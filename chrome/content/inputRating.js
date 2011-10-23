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
 * Singleton that manages requests of input rating and steadiness
 */
RSETB.inputRating = function(){

    var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_VOTE, 'GET', true);

    // Get publisher methods
    var publisher = new MBJSL.Publisher();

    /**
     * Request rating and steadiness info about a specific document, given an url
     *
     * @param url
     */
    publisher.requestRating = function(url){

        requestManager.request(
            // Params of request
            {
                url : url
            },

            // Successful request callback
            function(doc){
                var ratingResponseParser = new RSETB.LoginResponseParser(doc);
                // Parse XML document
                try{
                    var outcome = ratingResponseParser.getOutcome();
                    var response = ratingResponseParser.checkResponse();
                }
                catch(error){
                    //TODO: manage this error
                    alert("Error not managed yet: " + error);
                }

                if(outcome == "ok"){
                    publisher.publish("rating", response.rating);
                    publisher.publish("steadiness", response.steadiness);
                }else{
                    publisher.publish("no-rating", response.description);
                    publisher.publish("no-steadiness", response.description);
                }
            },

            // Failed request callback
            function(error){
                //TODO: manage this failed request
                alert("Failed request not managed yet: " + error);
            }
        );
    };

    return publisher;

};