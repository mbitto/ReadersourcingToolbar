/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

RSETB.login = function(requestManager, loginModal){

    var userId = null;

    /**
     * Callback function passed to the modal window
     *
     * @param username username received from modal window
     * @param password password received from modal window
     */
    var sendUserParams = function(username, password){

        requestManager.request(
            // Params of request
            {
                username : username,
                password: password
            },

            // Successful request callback
            function(doc){
                var loginResponseParser = new RSETB.LoginResponseParser(doc);
                try{
                    var outcome = loginResponseParser.getOutcome();
                    var response = loginResponseParser.checkResponse();
                }catch(error){
                    loginModal.erroneusRequest(error);
                }
                if(outcome == "ok"){
                    loginModal.successfulLogin(response);
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

        },
        /**
         * Open modal window to login . If fields are complete, send params to server
         *
         */
        openLoginModal : function(){

            loginModal.addOkCallback(this.modalOk);
            loginModal.addCancelCallback(this.modalCancel);

            /* Open the modal window (from here function wait until modal window will be closed)
             * checkUserParam is the callback passed to modal window to call when user fill the form
             */
            window.openDialog(RSETB.LOGIN_MODAL, "loginModal", windowFeatures, loginModal);

            // User has filled all the fields
           /* if(credentials.username != null && credentials.username != null){
                _widget['loginProgress'].setVisible(true);
                core.loginRequest.setLogin(loginParams);
            }*/

        },
        getUserId : function(){
            return userId;
        }
    };
};