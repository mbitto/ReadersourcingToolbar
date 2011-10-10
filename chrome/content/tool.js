/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * @constructor
 * A tool for toolbar
 */

RSETB.Tool = function(name, xulElementId){

    FBC().log("Tool initialized");

    /**
     * XUL DOM element reference
     */
    var xulElementReference = document.getElementById(xulElementId);

    var callback = null;

    var params = [];

    /**
     * Execute callback function
     */
    var executeCallback = function(){
        callback.apply(this, params);
    };

    /**
     * Register a function to call when click event is generated from this tool
     *
     * @param cb callback
     * @param par one or more params for callback function
     */
    this.registerCallback = function(cb, par){
        if(callback !== null){
            throw new Error('Callback function is already defined for ' + name + ' tool');
        }
        for(var arg in arguments){
            params.push(arguments[arg]);
        }
        params.shift();
        callback = cb;
        xulElementReference.addEventListener('click', function(){ executeCallback() }, false);
    };


    /**
     * Set disabled state and add or remove associated event listener
     *
     * @param disable boolean
     */
    this.setDisabled = function(disable){
        var enable = !disable;
        if(enable && xulElementReference.disabled){
            xulElementReference.addEventListener('click', function(){executeCallback()}, false);
        }
        else if (disable && !xulElementReference.disabled){
            xulElementReference.removeEventListener('click', function(){ executeCallback()}, false);
        }
        xulElementReference.disabled = disable;
    };

    /**
     * Get activation state
     */
    this.getDisabledState = function(){
        return xulElementReference.disabled;
    };

    /**
     * Get name
     */
    this.getName = function(){
        return name;
    };

    /**
     * Get the id of associated XUL element
     */
    this.getXulElementId = function(){
        return xulElementId;
    };

};