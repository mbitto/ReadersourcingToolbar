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
 * Singleton that manages basic function of login modal window
 */


RSETB.loginModal = function(okCallback, cancelCallback){

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


    //TODO: move id of XUL elements to ini.js
    return {

        initialize : function(modalDoc){

            FBC().log("loginModal initialized");
            
            xulUsernameReference = modalDoc.getElementById("rsour_loginModalUsername");
            xulPasswordReference = modalDoc.getElementById("rsour_loginModalPassword");
            xulDescriptionReference = modalDoc.getElementById("rsour_loginModalDescription");
            xulForgotPasswordReference = modalDoc.getElementById("rsour_modalForgotPassword");
            xulForgotPasswordReference.addEventListener('click', forgotPassword, 'false');
            xulRegisterReference = modalDoc.getElementById("rsour_modalRegisterNewUser");
            xulRegisterReference.addEventListener('click', registerToRS, 'false');
        },

        doOk : function() {
            if (!fieldsFilledIn()) {
                askForFormFill();
                return false;
            }

            // Pass info to login
            var username = xulUsernameReference.value;
            var password = xulPasswordReference.value;
            var temp = okCallback(username,password);
            console.log(temp);
            return true;
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
        }
    };
};