/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};


/**
 * Singleton that manages authentications and logout to the server
 *
 * @param loginModal
 */
RSETB.authentication = function(loginModal){

    var userId = null;
    
    // Get publisher methods
    var publisher = new MBJSL.Publisher();

    /**
     * Callback function passed to the modal window
     *
     * @param username username received from modal window
     * @param password password received from modal window
     */
    var sendUserParams = function(username, password){

        var requestManager = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGIN, 'POST', true);

        requestManager.request(
            // Params of request
            {
                username : username,
                password: password
            },

            // Successful request callback
            function(doc){
                var loginResponseParser = new RSETB.LoginResponseParser(doc);
                // Parse XML document
                try{
                    var outcome = loginResponseParser.getOutcome();
                    var response = loginResponseParser.checkResponse();
                }catch(error){
                    loginModal.badXMLRequest(error);
                }

                if(outcome == "ok"){
                    loginModal.successfulLogin(response);
                    publisher.publish("login");
                    loginModal.closeModal(1000);
                    // TODO: gestire i messaggi e i rating tools
                }else{
                    loginModal.failedLogin(response);
                }
            },

            // Failed request callback
            function(error){
                loginModal.failedRequest(error);
            }
        );
    };

    // Modal window options
    var windowFeatures = "centerscreen, chrome, modal";

    /**
     * Open modal window to login . If fields are complete, send params to server
     *
     */
    publisher.openLoginModal = function(){

        loginModal.addOkCallback(this.modalOk);
        loginModal.addCancelCallback(this.modalCancel);

        window.openDialog(RSETB.LOGIN_MODAL, "loginModal", windowFeatures, loginModal);

    };

    /**
     * Function interface for login modal window to communicate username and password
     *
     * @param username
     * @param password
     */
    publisher.modalOk = function(username, password){
        sendUserParams(username, password);
    };

    /**
     * Function interface for login modal window to communicate closure of window
     */
    publisher.modalCancel = function(){
        loginModal.closeModal();
    };

    publisher.getUserId = function(){
        return userId;
    };
    
    publisher.logout = function(){
        var logoutRM = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGOUT, 'GET', true);
        logoutRM.request(
            // Empty request
            null,
            // Success logout function callback
            function(){
                publisher.publish("logout");
                //TODO: Hide voting tools
            },
            // Failed logout function callback
            function(){
                //TODO: Show error window
            }
        );
    };

    return publisher;
};