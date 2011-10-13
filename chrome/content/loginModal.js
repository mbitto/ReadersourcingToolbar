/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

//TODO: this should be a instantiable object

/**
 * Singleton that manages basic function of login modal window
 */


RSETB.loginModal = function(){

    var okCallback = null;
    var cancelCallback = null;

    var xulUsernameReference = null;
    var xulPasswordReference = null;
    var xulDescriptionReference = null;
    var xulForgotPasswordReference = null;
    var xulRegisterReference = null;
    var username = null;
    var password = null;

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

    var forgotPassword = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.PASSWORD_RESET_PAGE);
        this.doCancel();
    };

    var registerToRS = function(){
        RSETB.readersourcingExtension.openNewTab(RSETB.REGISTRATION_PAGE);
        this.doCancel();
    };

    return{

        addModalScope : function(modalDoc){
            FBC().log("loginModal initialized");
            xulUsernameReference = modalDoc.getElementById(RSETB.MODAL_USERNAME_FIELD);
            xulPasswordReference = modalDoc.getElementById(RSETB.MODAL_PASSWORD_FIELD);
            xulDescriptionReference = modalDoc.getElementById(RSETB.MODAL_DESCRIPTION_TEXT);
            xulForgotPasswordReference = modalDoc.getElementById(RSETB.MODAL_FORGOT_PASSWORD_LINK);
            xulRegisterReference = modalDoc.getElementById(RSETB.MODAL_REGISTER_LINK);
            xulForgotPasswordReference.addEventListener('click', forgotPassword, 'false');
            xulRegisterReference.addEventListener('click', registerToRS, 'false');
        },

        addOkCallback : function(okCB){
            okCallback = okCB;
        },

        addCancelCallback : function(cancelCB){
            cancelCallback = cancelCB;
        },

        doOk : function() {
            if (!fieldsFilledIn()) {
                askForFormFill();
                return false;
            }

            // Pass info to login
            var username = xulUsernameReference.value;
            var password = xulPasswordReference.value;
            okCallback(username,password);
        },

        doCancel : function() {
            cancelCallback();
            return true;
        },

        failedLogin : function (){
            askForRepeatLogin();
        },

        successfulLogin : function(){
            // Close window
        },

        failedRequest : function(){
            // Warn user
        },

        erroneusRequest : function(){
            
        }
    };

};