/**
 * Project: Manuel Bitto Javascript Libraries
 * Version: 0.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 *
 * Observer pattern, a publisher keep subscriber functions callbacks,
 * divided by category of publish type.
 * A subscriber can register itself for many types of publication,
 * and a publisher can publish to many observers.
 *
 */

// Define Manuel Bitto JavaScript Library (MBJSL) namespace
var MBJSL = MBJSL || {};


/**
 * @constructor
 * Base object for publishers
 * 
 */
MBJSL.Publisher = function(){

    /**
     * Subscribers that are waiting for new publications
     */
    var subscribers = { any:[], ALL:[] };

    /**
     * Subscribe an observer
     *
     * @param subscriberFunc function to call when a new publication is released
     * @param type of publication that subscriber is waiting for. If not specified a default type "any" will be used.
     *        if type is ALL the subscriber function will be called for all types of publishes
     */
    this.subscribe = function (subscriberFunc, type){
        type = type || 'any';
        //if type not exists yet create a new array
        var typeOfSubscription = typeof subscribers[type];
        if (typeOfSubscription  === "undefined"){
            subscribers[type] = [];
        }
        subscribers[type].push(subscriberFunc);
    };

    /**
     * Unsubscribe an object
     *
     * @param subscriberFunc function that is associated to a type of subscription
     * @param type of publication that subscriber is waiting for
     */
    this.unsubscribe = function (subscriberFunc, type) {
        type = type || 'any';
        var subscribers = subscribers[type];

        //check if someone is subscribed to this type of publication
        if(subscribers != null){
            var max = subscribers.length;
            var i = 0;
            var found = false;
            while (i < max && !found){
                if (subscribers[i] === subscriberFunc) {
                    //remove subscriber
                    subscribers.splice(i, 1);
                    found = true;
                }
                i++;
            }
        }
    };

    /**
     * Publish to subscribers some type of publication
     *
     * @param type of publication
     * @param param to pass to subscribers
     */
    this.publish = function (type, param) {
        type = type || 'any';
        var subscribersType = subscribers[type];

        //check if someone is subscribed to this type of publication
        if(subscribersType != null){
            var max = subscribersType.length;
            for (var i = 0; i < max; i += 1) {
                subscribersType[i](param);
            }
        }

        var all = subscribers['ALL'];
        for(var j = 0; j < all.length; j++){
            all[j](param);
        }
    };
};