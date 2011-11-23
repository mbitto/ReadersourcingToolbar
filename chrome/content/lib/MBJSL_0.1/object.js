/**
 * Project: Manuel Bitto Javascript Libraries
 * Version: 0.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 */


var MBJSL = MBJSL || {};

/**
 * Set the prototype of F() to be the object from where inherit, and return F
 * 
 * @param parent object from where inherit
 *
 * @return new object that inherit from parent
 * 
 */
MBJSL.object = function(parent) {
    function F() {}
    F.prototype = parent;
    return new F();
};