/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 26/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Object that keeps in memory last received paper informations
 */
RSETB.cache = function(){

    // Time, in minutes, to clear cache
    var clearEvery = RSETB.CLEAR_CACHE_DEFAULT_TIME;
    // Maximum number of papers allowed in cache
    var maxPapers = RSETB.MAX_PAPER_IN_CACHE;
    // Literal of cached papers
    var papersInfo = {};

    /**
     * Return true if cache is full
     */
    var isFull = function(){
        return Object.keys(papersInfo).length === maxPapers;
    };

    /**
     * Deletes the entire cache
     */
    setTimeout(function(){
        papersInfo = {};
    }, clearEvery * 1000 * 60);

    return{
        /**
         * Set time, in minutes, to clear cache
         *
         * @param minutes
         */
        setClearCacheTime : function(minutes){
            clearEvery = minutes;
        },

        /**
         * Set the max numbers of papers allowed in cache
         *
         * @param qty number of papers allowed in cache
         */
        setMaxPaperInCache : function(qty){
            maxPapers = qty;
        },

        /**
         * Get paper with a defined url if it exists in cache
         *
         * @param url
         */
        getPaper : function(url){
            return papersInfo[url] || null;
        },

        /**
         * Check if paper with a given url exists in cache
         *
         * @param url
         */
        isPaperInCache : function(url){
            return this.getPaper(url) !== null;
        },

        /**
         * Add a paper in cache if it not exists yet.
         * If cache is full delete first element of cache and add the new paper as last element
         *
         * @param url
         * @param paper
         */
        addPaper : function(url, paper){
            if(!papersInfo.hasOwnProperty(url)){
                if(isFull()){
                    for(var i in papersInfo){
                        delete papersInfo[i];
                        break;
                    }
                }
                papersInfo[url] = paper;
            }
            FBC().log(papersInfo);
        },

        /**
         * Set paper as rated
         *
         * @param url
         */
        setPaperRated : function(url){
            if(papersInfo.hasOwnProperty(url)){
                papersInfo[url].rated = true;
            }
        },

        isPaperRated : function(url){
            if(papersInfo.hasOwnProperty(url)){
                return papersInfo[url].rated ? true : false;
            }
            else{
                return false;
            }
        }
    };
};