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
        setInterval(function(){

            requestManager.request(
                // No params needed here
                null,
                // Succesfull callback
                function(doc){
                    messagesResponseParser.setDocument(doc, 'get-msg');
                    // Parse XML document
                    try{
                        var outcome = messagesResponseParser.getOutcome();
                        var response = messagesResponseParser.checkResponse();
                    }
                    catch(error){
                        // XML parse error
                        RSETB.notificationBox(error);
                    }

                    if(outcome == "ok"){
                        if(response.messagesQty <= 0){
                            publisher.publish("no-new-messages", response);
                        }
                        else{
                            publisher.publish("new-messages", response);
                        }
                    }else{
                        // Outcome is KO communicate error to user
                        RSETB.notificationBox(response.description);
                    }
                },
                // Failed request callback
                function(error){
                    RSETB.notificationBox(error, RSETB.HOME_PAGE);
                }
            );
        }, RSETB.CHECK_FOR_MESSAGES_DEFAULT_TIME * 60 * 1000);
    };
    return publisher;
};