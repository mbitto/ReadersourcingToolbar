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
 * @constructor A basic tool for the toolbar
 *
 * @param xulElementId id of element associated to this tool
 */

RSETB.Tool = function(xulElementId){

    FBC().log("Tool initialized");

     // XUL DOM element reference
    this._xulElementId = xulElementId;
    this._xulElementReference = document.getElementById(xulElementId);
    this._callback = null;

    /**
     * Set disabled state and add or remove associated event listener
     *
     * @param disable boolean
     */
    this._setDisabled = function(disable){
        var enable = !disable;
        if(enable && this._xulElementReference.disabled){
            this._xulElementReference.addEventListener('click', function(){this._executeCallback()}, false);
        }
        else if (disable && !this._xulElementReference.disabled){
            this._xulElementReference.removeEventListener('click', function(){ this._executeCallback()}, false);
        }
        this._xulElementReference.disabled = disable;
    };

    /**
     * Register a function to call when click event is generated from this tool
     *
     * @param cb callback
     * @param par one or more params for callback function
     */
    this.registerUIEvent = function(cb){
        if(this._callback !== null){
            throw new Error('Callback function is already defined for this tool');
        }
        this._callback = cb;
        // Use self because this method is public and we need to bind *this* to this object
        var self = this;
        this._xulElementReference.addEventListener('click', function(e){
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            self._callback.call(self, e, args)
        }, false);
    };

    this.setEnabled = function(){
        this._setDisabled(false);
    };

    this.setDisabled = function(){
        this._setDisabled(true);
    };

    this.hide = function(visible){
        this._xulElementReference.setAttribute("style", visible ? "display : -moz-inline-box" : "display : none");
    };

    /**
     * Get activation state
     */
    this.getDisabledState = function(){
        return this._xulElementReference.disabled;
    };

    /**
     * Get the id of associated XUL element
     */
    this.getXulElementId = function(){
        return this._xulElementId;
    };

    /**
     * Get XUL element reference
     */
    this.getXulElementReference = function(){
        return this._xulElementReference;
    };
};


/**
 * @constructor Tool that manages input rating stars behaivour
 *
 * @param xulElementId
 */
RSETB.InputRatingTool = function(xulElementId){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this._xulStarsContainer = document.getElementById(RSETB.INPUT_RATING_STAR_CONTAINER);
    this._xulStars = this._xulStarsContainer.childNodes;
    this._starsQty = this._xulStars.length;
    this._stars = [];
    this._rating = 0;

    // Assign to each xul star image a new Star object that controls it
    for (var i = 1; i <= this._starsQty; i++) {
        this._stars[i] = new RSETB.Star(this._xulStars[i - 1]);
    }

    /**
     * Switch off all stars
     */
    this.switchOff = function(){
        // Set input rating
        for (var i = 1; i <= this._starsQty; i++) {
            this._stars[i].off();
        }
    };

    /**
     * Paint all stars as empty
     */
    this.allStarsEmpty = function(){
        // Set input rating
        for (var i = this._starsQty; i >= 1; i--) {
            this._stars[i].empty();
        }
        this._rating = 0;
    };

    // Initialize all stars as switched off
    this.switchOff();

    /**
     * Set the given rating to input stars painting a quantity of stars equal to rating value
     *
     * @param response form server
     */
    this.setRating = function(response){

        var rating = response.rating;

        if(rating < 1 || rating > this._starsQty){
            throw new Error("Rating should be between  1 and " + this._starsQty);
        }

        var currentRating = this._rating;

        var iterator = 1;
        var ratingFloor = Math.floor(rating);

        if(rating >= currentRating){
            iterator = Math.floor(currentRating);
            if(iterator < 1){
                iterator = 1;
            }
            // Turn on stars
            for (iterator; iterator <= ratingFloor; iterator++) {
                this._stars[iterator].full();
            }
        }
        else{
            iterator = ratingFloor + 1;
            // Switch off stars
            for (iterator; iterator <= this._starsQty; iterator++) {
                this._stars[iterator].empty();
            }
        }

        // Set float input rating
        var floatValue = rating - ratingFloor;

        if (floatValue >= RSETB.MIN_VALUE_FOR_HALF_STAR &&
            floatValue < RSETB.MAX_VALUE_FOR_HALF_STAR) {
                this._stars[ratingFloor].half();
        }
        else {
            if (floatValue >= RSETB.MAX_VALUE_FOR_HALF_STAR) {
                this._stars[ratingFloor].full();
            }
        }

        this._rating = rating;
    };
};


/**
 * @constructor Tool that manages steadiness indicator
 *
 * @param xulElementId
 */
RSETB.SteadinessTool = function(xulElementId){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);
    this._xulSteadinessImage = document.getElementById(RSETB.STEADINESS_IMAGE);

    this.setSteadiness = function(response){

        var steady = response.steadiness;

        switch (steady){
            case 1 : this._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_1; break;
            case 2 : this._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_2; break;
            case 3 : this._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_3; break;
            default : this._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
        }
    };

    this.switchOff = function(){
        this._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
    };
};


/**
 * @constructor Tool that display how many comments a paper has
 *
 * @param xulElementId
 */
RSETB.CommentsTool = function(xulElementId){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this._xulCommentsLink = document.getElementById(RSETB.COMMENTS_TOOL_LINK);

    this.setMessagesQty = function(response){

        if(response.messagesQty < 1){
            this.setNoMessages();
        }
        else{
            this._xulCommentsLink.textContent = response.messagesQty;
        }
    };

    this.setNoMessages = function(){
        this._xulCommentsLink.textContent = 0;
    };
};


/**
 * @constructor Tool that manages output rating
 *
 * @param xulElementId
 */
RSETB.OutputRatingTool = function(xulElementId, inputRatingToolReference){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this._xulStarsContainer = document.getElementById(RSETB.OUTPUT_RATING_STARS_CONTAINER);
    this._xulSubmitButton = document.getElementById(RSETB.OUTPUT_RATING_SUBMIT_BUTTON);
    this._xulStars = this._xulStarsContainer.childNodes;

    this._starsQty = this._xulStars.length;
    
    this._stars = [];
    this._rating = 0;

    this._starsLocked = false;
    this._starsInactive = false;

    this._rollOutTimeout = null;

    for (var j = 1; j <= this._starsQty; j++) {
        this._stars[j] = new RSETB.Star(this._xulStars[j - 1]);
    }

    // Initialize event listeners to every star of starsManager
    for (var i = 0; i < this._xulStars.length; i++) {
        // Variable "i" is managed with a closure to make its value persistent for each cycle
        //TODO : check for this closure, suspect of multiple execution
        var self = this;
        (function(i){
            self._xulStars[i].onmouseover = function(){
                self._starRollOver(i + 1);
            };
            self._xulStars[i].onmouseout = function(){
                self._starRollOut();
            };
            self._xulStars[i].onclick = function(){
                self._starSelected(i + 1);
            };
        })(i);
    }

    // Set rating to stars
    this._setRating = function(rating){

        var ratingObject = {rating: rating};
        // Call the InputRatingTool borrowed method
        inputRatingToolReference.setRating.call(this, ratingObject);
    };

    // Turn on selected stars from left to right
    this._starRollOver = function(rating){
        if (!this._starsLocked && !this._starsInactive) {
            if(this._rollOutTimeout !== null){
                clearTimeout(this._rollOutTimeout);
            }
            this._setRating(rating);
        }
    };

    // Set all stars empty
    this._starRollOut = function(){
        if (!this._starsLocked && !this._starsInactive) {
            var self = this;
            this._rollOutTimeout = setTimeout(function(){
                self._allStarsEmpty();
            },100);
        }
    };

    // Block selected star
    this._starSelected = function(rating){
        if(!this._starsInactive){
            if (this._starsLocked){
                this._starsLocked = false;
            }
            this._setRating(rating);
            this._starsLocked = true;
            this._enableRatingButton();
        }
    };

    this._enableRatingButton = function(){
        this._xulSubmitButton.disabled = false;
        this._xulSubmitButton.image = RSETB.OUTPUT_RATING_SUBMIT_IMAGE_ON;
    };

    this._disableRatingButton = function(){
        this._xulSubmitButton.disabled = true;
        this._xulSubmitButton.image = RSETB.OUTPUT_RATING_SUBMIT_IMAGE_OFF;
    };

    this._allStarsEmpty = function(){
        inputRatingToolReference.allStarsEmpty.call(this);
    };

    // Initialize all stars as empty
    this._allStarsEmpty();

    this._switchOffStars = function(){
        inputRatingToolReference.switchOff.call(this);
    };

    // Initialize rating button as disabled
    this._enableRatingButton();

    /**
     * Overwrite Tool executeCallback function
     */
    this._executeCallback = function(e){
        if(e.target === this._xulSubmitButton){
            if(!this._starsInactive){
               this._callback.call(this, this._rating);
            }
        }
    };

    // Overwrite Tool method setDisable
    this.setDisabled = function(disable){
        if(disable){
            this._switchOffStars();
            this._disableRatingButton();
            this._starsInactive = true;
        }
        else{
            this._allStarsEmpty();
            this._starsInactive = false;
        }
    };
};