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
    var paperName = "";

    /**
     * Check if field is filled
     */
    var fieldFilledIn = function() {
        return  ((xulCommentTextboxReference.value != ""));
    };

    /**
     * Ask user to fill in the form or continue
     */
    var askForFormFill = function(){
        xulDescriptionReference.setAttribute("value", RSETB.COMMENT_MODAL_ERROR_USER_MESSAGE);
        xulDescriptionReference.setAttribute("style", "color: " + RSETB.MODAL_ERROR_TEXT_COLOR);
    };

    return{
        /**
         * Set the modal window scope
         *
         * @param modalScope
         */
        addModalScope : function(modalScope){
            modal = modalScope;
            modalDialog = modalScope.document;
            xulCommentTextboxReference = modalDialog.getElementById(RSETB.MODAL_COMMENT_FIELD);
            xulDescriptionReference = modalDialog.getElementById(RSETB.MODAL_COMMENT_DESCRIPTION_TEXT);
            xulDescriptionReference.value = RSETB.COMMENT_MODAL_USER_MESSAGE;
            var xulBoldDescriptionReference = modalDialog.getElementById(RSETB.MODAL_COMMENT_DESCRIPTION_TEXT_BOLD);
            xulBoldDescriptionReference.value = paperName;
        },

        /**
         * Set callback for OK button
         *
         * @param okCB
         */
        addOkCallback : function(okCB){
            okCallback = okCB;
        },

        /**
         * Set callback for cancel button
         *
         * @param cancelCB
         */
        addCancelCallback : function(cancelCB){
            cancelCallback = cancelCB;
        },

        /**
         * Action called when user press OK button
         */
        doOk : function() {
            if (!fieldFilledIn()) {
                askForFormFill();
            }
            else{
                // Pass info back
                var comment = xulCommentTextboxReference.value;
                okCallback(comment);
            }
        },

        /**
         * Action called when user press Cancel button
         */
        doCancel : function() {
            cancelCallback();
        },

        /**
         * Close modal window after a defined time in ms
         * 
         * @param time (default is 50 ms)
         */
        closeModal : function(time){
            time = time || 50;
            modal.setTimeout(function(){
                modal.close();
            }, time)
        },

        setPaperName : function(name){
            paperName = name;
        }
    };
};