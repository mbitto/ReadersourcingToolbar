/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 29/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Object that manages requests of input rating and steadiness
 */
RSETB.messages = function(messagesResponseParser){

    var requestManager = new RSETB.RequestManager(RSETB.URL_REQUESTS_MESSAGES, 'GET', true);

    // Create a publisher to mix its methods with inputRating
    var publisher = new MBJSL.Publisher();

    publisher.init = function(){
        setTimeout(function(){

            requestManager.request(
                // No params needed here
                null,

                // Succesfull callback
                function(doc){
                    messagesResponseParser.setDocument(doc, 'set-paper-vote');
                    // Parse XML document
                    try{
                        var outcome = messagesResponseParser.getOutcome();
                        var response = messagesResponseParser.checkResponse();
                    }
                    catch(error){
                        //TODO: manage this error and test it
                        alert("Error not managed yet: " + error);
                    }

                    if(outcome == "ok"){
                        if(response.messagesQty == 0){
                            publisher.publish("no-new-messages", response);
                        }
                        else{
                            publisher.publish("new-messages", response);
                        }
                    }else{
                        // TODO: manage this situation
                    }
                },

                // Failed request callback
                function(error){
                    //TODO: manage this failed request and test it
                    alert("Failed request not managed yet: " + error);
                }
            );
        }, RSETB.CHECK_FOR_MESSAGES_DEFAULT_TIME * 60 * 1000);
    };
    return publisher;
};