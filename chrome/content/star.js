/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * @Constructor manages star behavior
 *
 * @param xulStarReference
 */
RSETB.Star = function(xulStarReference){

    // Path of images used to change the star status
    var imagesToPreload = {
        fullStar: RSETB.RATING_STAR_ON,
        halfStar: RSETB.RATING_STAR_HALF,
        emptyStar: RSETB.RATING_STAR_EMPTY,
        offStar: RSETB.RATING_STAR_OFF
    };

    var starImages = [];

    // Preload images
    for (var image in imagesToPreload) {
        starImages[image] = new Image();
        starImages[image].src = imagesToPreload[image];
    }

    /**
     * Change image of the star to full
     */
    this.full = function(){
        xulStarReference.src = starImages.fullStar.src;
    };

    /**
     * Change image of the star to half
     */
    this.half = function(){
        xulStarReference.src = starImages.halfStar.src;
    };

    /**
     * Change image of the star to empty
     */
    this.empty = function(){
        xulStarReference.src = starImages.emptyStar.src;
    };

    /**
     * Change image of the star to off
     */
    this.off = function(){
        xulStarReference.src = starImages.offStar.src;
    };
};
