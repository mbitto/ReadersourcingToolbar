/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

RSETB.Star = function(xulStarReference){

    var imagesToPreload = {
        fullStar: RSETB.RATING_STAR_ON,
        halfStar: RSETB.RATING_STAR_HALF,
        emptyStar: RSETB.RATING_STAR_EMPTY,
        offStar: RSETB.RATING_STAR_OFF
    };

    var starImages = [];

    for (var image in imagesToPreload) {
        starImages[image] = new Image();
        starImages[image].src = imagesToPreload[image];
    }
    
    this.full = function(){
        xulStarReference.src = starImages.fullStar.src;
    };
    this.half = function(){
        xulStarReference.src = starImages.halfStar.src;
    };
    this.empty = function(){
        xulStarReference.src = starImages.emptyStar.src;
    };
    this.off = function(){
        xulStarReference.src = starImages.offStar.src;
    };
};
