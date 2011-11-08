/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Singleton that manages basic function of login modal window
 */
RSETB.loginModal = function(){

    var okCallback = null;
    var cancelCallback = null;

    var modal = null;

    var spinner = document.getElementById("rsour_login_spinner");

    var modalDialog = null;
    var xulUsernameReference = null;
    var xulPasswordReference = null;
    var xulDescriptionReference = null;
    var xulForgotPasswordReference = null;
    var xulRegisterReference = null;
    var username = null;
    var password = null;

    /**
     * Response to click on forgot password link
     */
    var forgotPassword = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.PASSWORD_RESET_PAGE);
        this.doCancel();
    };

    /**
     * Response to click on register to RS link
     */
    var registerToRS = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.REGISTRATION_PAGE);
        this.doCancel();
    };

    /**
     * Check if fields are filled in
     */
    var fieldsFilledIn = function() {
        return  ((xulUsernameReference.value != "") && (xulPasswordReference.value != ""));
    };

    /**
     * Ask user to fill the forms
     */
    var askForFormFill = function(){
        xulDescriptionReference.setAttribute("value", "Please fill in both fields");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    /**
     * Ask user to repeat login
     */
    var askForRepeatLogin = function(){
        xulDescriptionReference.setAttribute("value", "Invalid username or password");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    /**
     * Show welcome message
     */
    var welcomeMessage = function(){
        xulDescriptionReference.setAttribute("value", "Logged In!");
        xulDescriptionReference.setAttribute("style", "color: #ee11cc");
    };

    /**
     * Show logging in message
     */
    var loggingInMessage = function(){
        xulDescriptionReference.setAttribute("value", "Loggin In ... ");
        xulDescriptionReference.setAttribute("style", "color: #fafad2");
    };

    /**
     * Show a server error
     */
    var serverError = function(){
        xulDescriptionReference.setAttribute("value", "Something has gone wrong.");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    /**
     * Show a connection error
     */
    var connectionError = function(){
        xulDescriptionReference.setAttribute("value", "Something has gone wrong while connecting to the server.");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    return{

        /**
         * Set the scope of modal window
         *
         * @param modalScope
         */
        addModalScope : function(modalScope){
            modal = modalScope;
            modalDialog = modalScope.document;
            xulUsernameReference = modalDialog.getElementById(RSETB.MODAL_USERNAME_FIELD);
            xulPasswordReference = modalDialog.getElementById(RSETB.MODAL_PASSWORD_FIELD);
            xulDescriptionReference = modalDialog.getElementById(RSETB.MODAL_DESCRIPTION_TEXT);
            xulForgotPasswordReference = modalDialog.getElementById(RSETB.MODAL_FORGOT_PASSWORD_LINK);
            xulRegisterReference = modalDialog.getElementById(RSETB.MODAL_REGISTER_LINK);
            xulForgotPasswordReference.addEventListener('click', forgotPassword, 'false');
            xulRegisterReference.addEventListener('click', registerToRS, 'false');
        },

        /**
         * Set callback function for OK button
         *
         * @param okCB
         */
        addOkCallback : function(okCB){
            okCallback = okCB;
        },

        /**
         * Set callback function for Cancel button
         *
         * @param cancelCB
         */
        addCancelCallback : function(cancelCB){
            cancelCallback = cancelCB;
        },

        /**
         * When user press ok button check the form, and pass data to login object
         */
        doOk : function() {
            if (!fieldsFilledIn()) {
                askForFormFill();
            }
            else{
                // Pass info to login
                loggingInMessage();
                var username = xulUsernameReference.value;
                var password = xulPasswordReference.value;
                okCallback(username,password);
            }
        },

        /**
         * When user press cancel button, call login object related function and close modal window
         */
        doCancel : function() {
            cancelCallback();
        },

        /**
         * login has been accepted from the server
         */
        successfulLogin : function(response){
            welcomeMessage();
            this.closeModal(1000);
        },

        /**
         * Login hasn't been accepted from the server
         */
        failedLogin : function (response){
            askForRepeatLogin();
        },

        /**
         * Show server error
         */
        badXMLRequest : function(){
            serverError();
        },

        /**
         * Something gone wrong on request, ask to retry
         */
        failedRequest : function(){
            connectionError();
        },

        /**
         * Close modal window after a defined time in ms
         * 
         * @param time (default is 50 ms)
         */
        closeModal : function(time){
            //modal.close();
            time = time || 50;
            modal.setTimeout(function(){
                modal.close();
            }, time)
        }
    };

};