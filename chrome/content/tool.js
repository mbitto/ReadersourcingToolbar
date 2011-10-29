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

    FBC().log("Tool binded to " + xulElementId + " initialized");

     // XUL DOM element reference
    this._xulElementId = xulElementId;
    this._xulElementReference = document.getElementById(xulElementId);

    // By default active element is the same as container element
    this._xulActiveElementReference = this._xulElementReference;
    this._callback = null;

    this._enebled = true;

    var self = this;

    /**
     * Set disabled state and add or remove associated event listener
     *
     * @param disable boolean
     */
    this._setDisabled = function(disable){
        this._enebled = !disable;
        this._xulActiveElementReference.disabled = disable;
    };

    this.setActiveElement = function(activeElement){
        this._xulActiveElementReference = document.getElementById(activeElement);
    };

    /**
     * Register a function to call when click event is generated from this tool
     *
     * @param cb callback
     */
    this.registerUIEvent = function(cb){
        if(this._callback !== null){
            throw new Error('Callback function is already defined for this tool');
        }
        this._callback = cb;
        // Use self because this method is public and we need to bind *this* to this object
        var self = this;
        this._xulActiveElementReference.addEventListener('click', function(e){
            if(self._enebled){
                self._callback.call(self, e);
            }
        }, false);
    };

    this.setEnabled = function(){
        self._setDisabled(false);
    };

    this.setDisabled = function(){
        self._setDisabled(true);
    };

    this.show = function(visible){
        self._xulElementReference.setAttribute("style", visible ? "display : -moz-inline-box" : "display : none");
    };

    /**
     * Get activation state
     */
    this.getDisabledState = function(){
        return self._xulElementReference.disabled;
    };

    /**
     * Get the id of associated XUL element
     */
    this.getXulElementId = function(){
        return self._xulElementId;
    };

    /**
     * Get XUL element reference
     */
    this.getXulElementReference = function(){
        return self._xulElementReference;
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

    // Public methods must have reference to proper *this*
    var self = this;

    /**
     * Switch off all stars
     */
    this.switchOff = function(){
        // Set input rating
        for (var i = 1; i <= self._starsQty; i++) {
            self._stars[i].off();
        }
    };

    /**
     * Paint all stars as empty
     */
    this.allStarsEmpty = function(){
        // Set input rating
        for (var i = self._starsQty; i >= 1; i--) {
            self._stars[i].empty();
        }
        self._rating = 0;
    };

    // Initialize all stars as switched off
    this.switchOff();

    /**
     * Set the given rating to input stars painting a quantity of stars equal to rating value
     *
     * @param response form server
     */
    this.setRating = function(response){

        self.allStarsEmpty();

        var rating = response.rating;

        if(rating < 1 || rating > self._starsQty){
            throw new Error("Rating should be between  1 and " + self._starsQty);
        }

        var currentRating = self._rating;

        var iterator = 1;
        var ratingFloor = Math.floor(rating);

        if(rating >= currentRating){
            iterator = Math.floor(currentRating);
            if(iterator < 1){
                iterator = 1;
            }
            // Turn on stars
            for (iterator; iterator <= ratingFloor; iterator++) {
                self._stars[iterator].full();
            }
        }
        else{
            iterator = ratingFloor + 1;
            // Switch off stars
            for (iterator; iterator <= self._starsQty; iterator++) {
                self._stars[iterator].empty();
            }
        }

        // Set float input rating
        var floatValue = rating - ratingFloor;

        if (floatValue >= RSETB.MIN_VALUE_FOR_HALF_STAR &&
            floatValue < RSETB.MAX_VALUE_FOR_HALF_STAR) {
                self._stars[ratingFloor + 1].half();
        }
        else {
            if (floatValue >= RSETB.MAX_VALUE_FOR_HALF_STAR) {
                self._stars[ratingFloor + 1].full();
            }
        }

        self._rating = rating;
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

    // Public methods must have reference to proper *this*
    var self = this;

    this.setSteadiness = function(response){

        var steady = response.steadiness;

        /*
          FIXME: values of steadiness received from xml should be between 1 and 3.
          Now server returns float values that will be ceiled, and values higher than 3
          that will be revalued as 3
        */
        steady = Math.floor(steady) > 3 ? 3 : Math.ceil(steady);
        /*
          End of FIXME
        */

        FBC().log(steady);

        switch (steady){
            case 1 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_1; break;
            case 2 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_2; break;
            case 3 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_3; break;
            default : self._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
        }
    };

    this.switchOff = function(){
        self._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
    };
};


/**
 * @constructor Tool that display how many comments a paper has
 *
 * @param xulElementId
 */
RSETB.CommentsTool = function(xulElementId, xulActiveElementId){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this.setActiveElement(xulActiveElementId);

    // Public methods must have reference to proper *this*
    var self = this;

    this.setCommentsQty = function(response){

        if(response.commentsQty < 1){
            self.setNoComments();
        }
        else{
            self._xulActiveElementReference.textContent = response.commentsQty;
            self._xulActiveElementReference.setAttribute("class", "text-link rsour_link");
            self._setDisabled(false);
            // TODO: change baloon color
        }
    };

    this.setNoComments = function(){
        self._xulActiveElementReference.textContent = 0;
        self._xulActiveElementReference.removeAttribute("class");
        self._xulActiveElementReference.setAttribute("class", "rsour_link");
        self._setDisabled(true);
    };

    // Initialize with no messages
    this.setNoComments();

};


/**
 * @constructor Tool that manages output rating
 *
 * @param xulElementId
 */
RSETB.OutputRatingTool = function(xulElementId, inputRatingToolReference){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this.setActiveElement(RSETB.OUTPUT_RATING_SUBMIT_BUTTON);

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

    // Overwrite Tool method setDisabled
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

    this.getRating = function(){
        return this._rating;
    }
};