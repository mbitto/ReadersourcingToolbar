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
     * Set disabled state and add or remove associated event listener
     *
     * @param disable boolean
     */
    var setDisabled = function(disable){
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
     * Register a function to call when click event is generated from this tool
     *
     * @param cb callback
     * @param par one or more params for callback function
     */
    this.registerUIEvent = function(cb, par){
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

    this.setEnabled = function(){
        setDisabled(false);
    };

    this.setDisabled = function(){
        setDisabled(true);
    };

    this.hide = function(visible){
        xulElementReference.setAttribute("style", visible ? "display : -moz-inline-box" : "display : none");
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

    /**
     * Get XUL element reference
     */
    this.getXulElementReference = function(){
        return xulElementReference;
    };

};


/**
 * @constructor Tool that manages input rating stars behaivour
 *
 * @param name
 * @param xulElementId
 */
RSETB.InputRatingTool = function(name, xulElementId){
    
    // Inherits from Tool
    this.base = RSETB.Tool;
    this.base(name, xulElementId);

    var xulElementReference = this.getXulElementReference();
    var xulStarsContainer = xulElementReference.getElementsByClassName(RSETB.INPUT_RATING_STAR_CONTAINER)[0];
    var xulStars = xulStarsContainer.childNodes;
    var starsQty = xulStars.length;
    var inputStars = [];

    for (var i = 1; i <= starsQty; i++) {
        inputStars[i] = new RSETB.Star(xulStars[i - 1]);
    }

    this.setRating = function(rating){

        var iterator = 0;

        // Set input rating
        for (iterator = 1; iterator <= rating; iterator++) {
            inputStars[iterator].full();
        }
        var lastStar = iterator;
        for (iterator = iterator + 1; iterator <= starsQty; iterator++) {
            inputStars[iterator].empty();
        }

        // Set float input rating
        var integerValue = parseInt(rating, 10);

        var floatValue = rating - integerValue;
        if (floatValue >= RSETB.MIN_VALUE_FOR_HALF_STAR &&
            floatValue < RSETB.MAX_VALUE_FOR_HALF_STAR) {
                inputStars[lastStar].half();
        }
        else {
            if (floatValue >= RSETB.MAX_VALUE_FOR_HALF_STAR) {
                inputStars[lastStar].full();
            }
        }
    };
        
    this.switchOff = function(){
        // Set input rating
        for (var i = 1; i <= starsQty; i++) {
            inputStars[i].empty();
        }
    };
};

// Ensure descendant prototype update
RSETB.InputRatingTool.prototype = RSETB.Tool;



/**
 * @constructor Tool that manages steadiness indicator
 *
 * @param name
 * @param xulElementId
 */
RSETB.SteadinessTool = function(name, xulElementId){

    // Inherits from Tool
    this.base = RSETB.Tool;
    this.base(name, xulElementId);

    var xulElementReference = this.getXulElementReference();

    this.setSteadiness = function(steady){

    };

    this.switchOff = function(){
        
    };
};

// Ensure descendant prototype update
RSETB.InputRatingTool.prototype = RSETB.Tool;