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
RSETB.inputRating = function(ratingResponseParser){

    var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_VOTE, 'GET', true);

    var paperId = null;

    // Create a publisher to mix its methods with inputRating
    var publisher = new MBJSL.Publisher();

    publisher.getPaperId = function(){
        return paperId;
    };

    // Cache where recent results are saved
    var cache = RSETB.cache();

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
                        //TODO: manage this error and test it
                        alert("Error not managed yet: " + error);
                    }

                    var paper = {url: url};

                    if(outcome == "ok"){
                        paper.outcome = outcome;
                        paper.response = response;
                        cache.addPaper(paper);
                        paperId = response.id;
                        publisher.publish("new-input-rating", response);
                    }else{
                        paper.outcome = outcome;
                        paper.response = response;
                        publisher.publish("no-input-rating", response);
                    }
                },

                // Failed request callback
                function(error){
                    //TODO: manage this failed request and test it
                    alert("Failed request not managed yet: " + error);
                }
            );
        }
    };
    return publisher;
};