/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 */

/**
 * Manage menu entry functions and behaviors
 */

RSETB.menuEntry = function(name, xulElementId){

    console.log("menuEntry initialized");

    /**
     * XUL DOM element reference
     */
    var xulElementReference = document.getElementById(xulElementId);

    /**
     * Keyword to publish when a click event is fired
     */
    var publishKeyword = null;

    /**
     * Param to add to publish function when event is fired
     */
    var publishParams = null;

    // Set the associated event listener to the element
    xulElementReference.addEventListener('click', function(){ publish(publishParams, publishKeyword) }, false);


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
         * Get the name of entry
         */
        getName : function(){
            return name;
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
        },

        /**
         * Set keyword to submit when publish
         *
         * @param keyword
         */
        setPublishKeyword : function(keyword){
            publishKeyword = keyword;
        },

        /**
         * Set params associated to publish submit
         *
         * @param params
         */
        setPublishParams : function(params){
            publishParams = params;
        }
    };

};