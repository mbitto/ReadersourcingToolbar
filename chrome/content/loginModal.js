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

    var modalDialog = null;
    var xulUsernameReference = null;
    var xulPasswordReference = null;
    var xulDescriptionReference = null;
    var xulForgotPasswordReference = null;
    var xulRegisterReference = null;
    var username = null;
    var password = null;

    var forgotPassword = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.PASSWORD_RESET_PAGE);
        this.doCancel();
    };

    var registerToRS = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.REGISTRATION_PAGE);
        this.doCancel();
    };

    var fieldsFilledIn = function() {
        return  ((xulUsernameReference.value != "") && (xulPasswordReference.value != ""));
    };

    var askForFormFill = function(){
        xulDescriptionReference.setAttribute("value", "Please fill in both fields");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    var askForRepeatLogin = function(){
        xulDescriptionReference.setAttribute("value", "Invalid username or password");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    var welcomeMessage = function(){
        xulDescriptionReference.setAttribute("value", "Logged In!");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    var serverError = function(){
        xulDescriptionReference.setAttribute("value", "Something has gone wrong.");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    var connectionError = function(){
        xulDescriptionReference.setAttribute("value", "Something has gone wrong while connecting to the server.");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    return{

        addModalScope : function(modalScope){
            FBC().log("loginModal initialized");

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

        addOkCallback : function(okCB){
            okCallback = okCB;
        },

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
            FBC().log('success');
            FBC().log(response);
            welcomeMessage();
            this.closeModal(1000);
        },

        /**
         * Login hasn't been accepted from the server
         */
        failedLogin : function (response){
            FBC().log('failed');
            FBC().log(response.messages);
            askForRepeatLogin();
        },

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