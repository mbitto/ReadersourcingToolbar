/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Object that manages requests of input rating and steadiness
 */
RSETB.outputRating = function(ratingResponseParser, commentModal, cache){

    var currentRating = null;
    var currentUrl = null;
    var paperName = null;

    var requestManager = new RSETB.RequestManager(RSETB.URL_SET_PAPER_VOTE, 'POST', true);

    // Modal window options
    var windowFeatures = "centerscreen, chrome, modal";

    /**
     * Set a new vote to Readersourcing, with an optional message associated
     *
     * @param url
     */
    var setRating = function(url, vote, comment){

        // Params of request
        var params = {
            url : url,
            vote : vote
        };

        // If there is a comment add it to request params
        if(typeof comment !== "undefined"){
            params.comment = comment;
        }

        requestManager.request(params,
            // Successful request callback
            function(doc){
                ratingResponseParser.setDocument(doc, 'set-paper-vote');
                // Parse XML document
                try{
                    var outcome = ratingResponseParser.getOutcome();
                    var response = ratingResponseParser.checkResponse();
                }
                catch(error){
                    // XML parse error
                    RSETB.notificationBox(error);
                }

                if(outcome == "ok"){
                    cache.setPaperRated(url);
                    publisher.publish("new-input-rating", response);
                }else{
                    publisher.publish("no-input-rating", response);
                }
            },

            // Failed request callback
            function(error){
                RSETB.notificationBox(error, RSETB.HOME_PAGE);
            }
        );
    };

    /**
     * Open comment modal where user can optionally write his comment
     */
    var openCommentModal = function(){

        commentModal.addOkCallback(modalOk);
        commentModal.addCancelCallback(modalCancel);
        commentModal.setPaperName(paperName);

        window.openDialog(RSETB.COMMENT_MODAL, "commentModal", windowFeatures, commentModal);
    };

    /**
     * Callback activated from modal ok button click
     *
     * @param comment
     */
    var modalOk = function(comment){
        setRating(currentUrl, currentRating, comment);
        commentModal.closeModal();
    };

    /**
     * Callback activate from modal cancel button click
     */
    var modalCancel = function(){
        setRating(currentUrl, currentRating);
        commentModal.closeModal();
    };

    // Create a publisher to get its methods
    var publisher = new MBJSL.Publisher();

    // Open comments modal and send rating to server
    publisher.sendRating = function(url, rating){
        currentUrl = url;
        currentRating = rating;
        openCommentModal();
    };

    publisher.setPaperName = function(name){
        paperName = name;
    };

    return publisher;

};