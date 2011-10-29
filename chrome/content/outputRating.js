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
 * Singleton that manages requests of input rating and steadiness
 */
RSETB.outputRating = function(ratingResponseParser, commentModal){

    var requestManager = new RSETB.RequestManager(RSETB.URL_SET_PAPER_VOTE, 'POST', true);

    // Create a publisher to get its methods
    var publisher = new MBJSL.Publisher();

    /**
     * Set a new vote to Readersourcing, with an optional message associated
     *
     * @param url
     */
    publisher.setRating = function(url, vote, comment){

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
                    //TODO: manage this error and test it
                    alert("Error not managed yet: " + error);
                }

                if(outcome == "ok"){
                    publisher.publish("new-input-rating", response);
                }else{
                    publisher.publish("no-input-rating", response);
                }
            },

            // Failed request callback
            function(error){
                //TODO: manage this failed request and test it
                alert("Failed request not managed yet: " + error);
            }
        );
    };

    // Modal window options
    var windowFeatures = "centerscreen, chrome, modal";

    publisher.openCommentModal = function(){

        commentModal.addOkCallback(this.modalOk);
        commentModal.addCancelCallback(this.modalCancel);

        window.openDialog(RSETB.COMMENT_MODAL, "commentModal", windowFeatures, commentModal);
    };

    publisher.modalOk = function(comment){
        //addComment(comment);
        FBC().log("add comment: " + comment);
        commentModal.closeModal();
    };

    publisher.modalCancel = function(){
        //noComment();
        FBC().log("no comment");
        commentModal.closeModal();
    };

    return publisher;

};