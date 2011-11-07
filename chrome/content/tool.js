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
 * @param xulElementId id of xul container element of this tool
 */

RSETB.Tool = function(xulElementId){

    FBC().log("Tool binded to " + xulElementId + " initialized");

    // Id of xul tool container
    this._xulElementId = xulElementId;
    // Get XUL element reference
    this._xulElementReference = document.getElementById(xulElementId);
    // Tool main image xul reference (if exists)
    this._xulMainImageReference = this._xulElementReference.getElementsByClassName("main-tool-image")[0];
    // Element of tool that respond to a user event. By default active element is the same as container element
    this._xulActiveElementReference = this._xulElementReference;
    // Tools are enabled by default
    this._enabled = true;
    // Callback function for user generated event on tool active element
    this._callback = null;

    var self = this;

    /**
     * Set disabled state and add or remove associated event listener
     *
     * @param disable state (boolean)
     */
    this._setDisabled = function(disable){
        this._enabled = !disable;
        this._xulActiveElementReference.disabled = disable;
        // TODO: take out these colors
        if(disable){
            this._xulElementReference.setAttribute("style", "color:#999999");
        }
        else{
            this._xulElementReference.setAttribute("style", "color:#000000");
        }
    };

    /**
     * Set the active element of tool
     *
     * @param activeElement xul node id of active element
     */
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
        this._xulActiveElementReference.addEventListener('click', function(e){
            if(self._enabled){
                self._callback.call(self, e);
            }
        }, false);
    };

    /**
     * Enable tool
     */
    this.setEnabled = function(){
        if(!self._enabled){
            self._setDisabled(false);
        }
    };

    /**
     * Disable tool
     */
    this.setDisabled = function(){
        if(self._enabled){
            self._setDisabled(true);
        }
    };

    /**
     * Make tool visible
     */
    this.show = function(){
        self._xulElementReference.setAttribute("style", "display : -moz-inline-box");
    };

    /**
     * Make tool not visible
     */
    this.hide = function(){
        self._xulElementReference.setAttribute("style", "display : none");
    };

    /**
     * Get activation state
     */
    this.getDisabledState = function(){
        return self._xulElementReference.disabled;
    };

    /**
     * Set image of tool main-image if exists
     *
     * @param image
     */
    this.setToolImage = function(image){
        if(typeof(self._xulMainImageReference) === "undefined"){
            throw new Error("No main image reference for tool binded to " + self._xulElementId);
        }
        FBC().log("image : " + image);
        self._xulMainImageReference.src = image;
        FBC().log("_xulMainImageReference.image: " + self._xulMainImageReference.src);
    };

    /**
     * Set tool tooltip text
     *
     * @param text of tooltip
     */
    this.setToolTip = function(text){
        self._xulElementReference.tooltipText = text;
    };

    this.setInfoToolTip = function(line1, line2){

        // Create a line 1 description node
        var tooltipNode = document.createElement("tooltip");
        tooltipNode.setAttribute("id", ("info-tooltip-" + this._xulElementId));
        tooltipNode.setAttribute("class", ("info-tooltip"));
        var tooltip = self._xulElementReference.appendChild(tooltipNode);
        var description1Node = document.createElement("description");
        description1Node.setAttribute("class", "info-tooltip-line1");
        var description1 = document.createTextNode(line1);
        description1Node.appendChild(description1);
        tooltip.appendChild(description1Node);

        // Create a line 2 description node
        var description2Node = document.createElement("description");
        description2Node.setAttribute("class", "info-tooltip-line2");
        var description2 = document.createTextNode(line2);
        description2Node.appendChild(description2);
        tooltip.appendChild(description2Node);
        // Add the tooltip reference to this tool
        this._xulElementReference.setAttribute("tooltip", ("info-tooltip-" + this._xulElementId));
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
        this.setDisabled();
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

    /**
     * Set the given rating to input stars painting a quantity of stars equal to rating value
     *
     * @param response form server
     */
    this.setRating = function(response){

        this.setEnabled();

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
                this._stars[ratingFloor + 1].half();
        }
        else {
            if (floatValue >= RSETB.MAX_VALUE_FOR_HALF_STAR) {
                this._stars[ratingFloor + 1].full();
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

    // Public methods must have reference to proper *this*
    var self = this;

    /**
     * Set steadiness value changing the main image of this tool
     *
     * @param response
     */
    this.setSteadiness = function(response){

        self.setEnabled();

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

        switch (steady){
            case 1 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_1; break;
            case 2 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_2; break;
            case 3 : self._xulSteadinessImage.src = RSETB.STEADINESS_VALUE_3; break;
            default : self._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
        }
    };

    /**
     * Set off image to steadiness tool
     */
    this.switchOff = function(){
        self._xulSteadinessImage.src = RSETB.STEADINESS_OFF;
        self.setDisabled();
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

    // Public methods must have reference to proper *this*
    var self = this;

    /**
     * Set the number of comments and change the label to "clickable"
     *
     * @param response
     */
    this.setCommentsQty = function(response){

        response.commentsQty = 5;

        if(response.commentsQty < 1){
            self.setNoComments();
        }
        else{
            self._xulActiveElementReference.textContent = response.commentsQty;
            self._xulActiveElementReference.setAttribute("class", "text-link rsour_link");
            self.setEnabled();
            // Change image color
        }
    };

    this.setNoComments = function(){
        self._xulActiveElementReference.textContent = 0;
        self._xulActiveElementReference.removeAttribute("class");
        self._xulActiveElementReference.setAttribute("class", "rsour_link");
        self.setDisabled();
    };
};


/**
 * @constructor Tool that manages output rating
 *
 * @param xulElementId
 * @param inputRatingToolReference A reference of input rating tool, to steal it some useful methods
 *
 */
RSETB.OutputRatingTool = function(xulElementId, inputRatingToolReference){

    // Inherits from Tool
    RSETB.Tool.call(this, xulElementId);

    this.setActiveElement(RSETB.OUTPUT_RATING_SUBMIT_BUTTON);

    // Output rating stars container
    this._xulStarsContainer = document.getElementById(RSETB.OUTPUT_RATING_STARS_CONTAINER);
    // Submit score button
    this._xulSubmitButton = document.getElementById(RSETB.OUTPUT_RATING_SUBMIT_BUTTON);
    // Array of reference of xul stars
    this._xulStars = this._xulStarsContainer.childNodes;
    this._starsQty = this._xulStars.length;

    // Array of Stars javascript objects
    this._stars = [];
    // Current Rating
    this._rating = 0;

    // When stars are locked don't change status on mouse over
    this._starsLocked = false;
    // Inactive stars are gray
    this._starsInactive = false;
    // A timeout before reset stars status after mouse over
    this._rollOutTimeout = null;

    // Make a new Star object from every xul reference
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

    /**
     * Set rating to stars
     * 
     * @param rating
     */
    this._setRating = function(rating){
        var ratingObject = {rating: rating};
        // Call the InputRatingTool borrowed method
        inputRatingToolReference.setRating.call(this, ratingObject);
    };

    /**
     * Turn on selected stars from left to right
     * 
     * @param rating
     */
    this._starRollOver = function(rating){
        if (!this._starsLocked && !this._starsInactive) {
            if(this._rollOutTimeout !== null){
                clearTimeout(this._rollOutTimeout);
            }
            this._setRating(rating);
        }
    };

    /**
     * Set all stars empty
     */
    this._starRollOut = function(){
        if (!this._starsLocked && !this._starsInactive) {
            var self = this;
            this._rollOutTimeout = setTimeout(function(){
                self._allStarsEmpty();
            },100);
        }
    };

    /**
     * Block selected star
     * 
     * @param rating
     */
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

    /**
     * Enable rating button
     */
    this._enableRatingButton = function(){
        this._xulSubmitButton.disabled = false;
        this._xulSubmitButton.image = RSETB.OUTPUT_RATING_SUBMIT_IMAGE_ON;
    };

    /**
     * Disable rating button
     */
    this._disableRatingButton = function(){
        this._xulSubmitButton.disabled = true;
        this._xulSubmitButton.image = RSETB.OUTPUT_RATING_SUBMIT_IMAGE_OFF;
    };

    /**
     * Set all stars empty
     */
    this._allStarsEmpty = function(){
        inputRatingToolReference.allStarsEmpty.call(this);
    };

    /**
     * Set all stars off
     */
    this._switchOffStars = function(){
        inputRatingToolReference.switchOff.call(this);
    };

    // Initialize all stars as empty
    this._allStarsEmpty();

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

    /**
     * Get current rating
     */
    this.getRating = function(){
        return this._rating;
    }
};