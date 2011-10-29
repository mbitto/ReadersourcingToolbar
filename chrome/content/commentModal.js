/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 28/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};


/**
 * Singleton that manages basic function of login modal window
 */
RSETB.commentModal = function(){

    var modal = null;
    var modalDialog = null;
    var okCallback = null;
    var cancelCallback = null;
    var xulCommentTextboxReference = null;
    var xulDescriptionReference = null;

    var fieldsFilledIn = function() {
        return  ((xulCommentTextboxReference.value != ""));
    };

    var askForFormFill = function(){
        xulDescriptionReference.setAttribute("value", "Please fill in comment field");
        xulDescriptionReference.setAttribute("style", "color: #ff0909");
    };

    return{
        addModalScope : function(modalScope){
            FBC().log("commentModal initialized");
            modal = modalScope;
            modalDialog = modalScope.document;
            xulCommentTextboxReference = modalDialog.getElementById(RSETB.MODAL_COMMENT_FIELD);
            xulDescriptionReference = modalDialog.getElementById(RSETB.MODAL_COMMENT_DESCRIPTION_TEXT);
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
            }
            else{
                // Pass info back
                var comment = xulCommentTextboxReference.value;
                okCallback(comment);
            }
        },

        doCancel : function() {
            cancelCallback();
        },

        /**
         * Close modal window after a defined time in ms
         * @param time (default is 50 ms)
         */
        closeModal : function(time){
            time = time || 50;
            modal.setTimeout(function(){
                modal.close();
            }, time)
        }
    };
};