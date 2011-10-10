/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 */

/**
 * Manage toolbar menu button and associated entries
 */
RSETB.menu = function(xulElementId){

    console.log("menu initialized");

    /**
     * @private XUL DOM element reference
     */
    var xulElementReference = document.getElementById(xulElementId);

    /**
     * @private Array of entries
     */
    var entries = [];

    // Set the associated event listener to the element
    xulElementReference.addEventListener('click', function(){ publish(publishParams, publishKeyword) }, false);


    /**
     * @public interface
     */
    return{

        /**
         * Set disabled state and add or remove associated event listener
         *
         * @param disable boolean
         */
        setDisabled : function(disable){
            var enable = !disable;
            if(enable && xulElementReference.disabled){
                xulElementReference.addEventListener('click', function(){ publish(publishParams, publishKeyword) }, false);
            }
            else if (disable && !xulElementReference.disabled){
                xulElementReference.removeEventListener('click', function(){ publish(publishParams, publishKeyword) }, false);
            }
            xulElementReference.disabled = disable;
        },

        /**
         * Get activation state
         */
        getDisabledState : function(){
            return xulElementReference.disabled;
        },

        /**
         * Get the id of associated XUL element
         */
        getXulElementId : function(){
            return xulElementId;
        }
    };

};