/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 27/09/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Object that manages requests of input rating and steadiness
 */
RSETB.inputRating = function(ratingResponseParser, cache){

    var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_VOTE, 'GET', true);
    var paperId = null;
    var firstLoad = true;

    // Create a publisher to mix its methods with inputRating
    var publisher = new MBJSL.Publisher();

    publisher.getPaperId = function(){
        return paperId;
    };

    /**
     * Request rating and steadiness info about a specific document, given an url
     *
     * @param url
     */
    publisher.requestRating = function(url){

        // If paper is already in cache get it
        if(cache.isPaperInCache(url)){
            var paper = cache.getPaper(url);
            if(paper.outcome === "ok"){
                paperId = paper.response.id;
                publisher.publish("new-input-rating", paper.response);
            }
            else{
                publisher.publish("no-input-rating", paper.response);
            }
        }
        // Make a request to server
        else{
            setTimeout(function(){
                requestManager.request(
                    // Params of request
                    {
                        url : url
                    },

                    // Successful request callback
                    function(doc){
                        ratingResponseParser.setDocument(doc, 'get-paper-vote');
                        // Parse XML document
                        try{
                            var outcome = ratingResponseParser.getOutcome();
                            var response = ratingResponseParser.checkResponse();
                        }
                        catch(error){
                            // XML parse error
                            RSETB.notificationBox(error, RSETB.HOME_PAGE);
                        }

                        var paper = {url: url};
                        paper.outcome = outcome;
                        paper.response = response;

                        if(outcome == "ok"){
                            paperId = response.id;
                            publisher.publish("new-input-rating", response);
                        }else{
                            publisher.publish("no-input-rating", response);
                        }
                        cache.addPaper(url, paper);
                    },

                    // Failed request callback
                    function(error){
                        RSETB.notificationBox(error, RSETB.HOME_PAGE);
                    }
                );
            },(firstLoad ? 1500 : 0));
            firstLoad = false;
        }
    };
    return publisher;
};