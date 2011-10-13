/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

RSETB.login = function(loginModal){

    var userId = null;

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


    return {
        /**
         * Function interface for login modal window to communicate username and password
         *
         * @param username
         * @param password
         */
        modalOk : function(username, password){
            sendUserParams(username, password);
        },
        /**
         * Function interface for login modal window to communicate closure of window
         */
        modalCancel : function(){
            loginModal.closeModal();
        },
        /**
         * Open modal window to login . If fields are complete, send params to server
         *
         */
        openLoginModal : function(){

            loginModal.addOkCallback(this.modalOk);
            loginModal.addCancelCallback(this.modalCancel);

            window.openDialog(RSETB.LOGIN_MODAL, "loginModal", windowFeatures, loginModal);

        },
        getUserId : function(){
            return userId;
        },
        logout : function(){
            var logoutRM = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGOUT, 'GET', true);
            logoutRM.request(
                // Empty request
                null,
                // Success logout function callback
                function(){
                    //TODO: Hide voting tools
                },
                // Failed logout function callback
                function(){
                    //TODO: Show error window
                }
            );
        }
    };
};