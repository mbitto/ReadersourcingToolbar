/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 29/09/11
 */

var jumlib = {};
Components.utils.import("resource://mozmill/modules/jum.js", jumlib);

var setupModule = function (module) {

    module.controller = mozmill.getBrowserController();

    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                       .getService(Components.interfaces.mozIJSSubScriptLoader);

    loader.loadSubScript("chrome://readersourcingToolbar/content/tool.js");

    var loginButton = "rsour_mainMenu";
    this.tool = new RSETB.Tool('testLogin', loginButton);

};


var setupTest = function(test) {
    this.myObj = {
        a: 10,
        b: false
    }
};

var teardownTest = function(test) {

};


var testMenuEntryButtonStatus = function() {
    this.jumlib.assertEquals(this.myObj.a, 10, "should be equals");
    this.jumlib.assertEquals(this.myObj.b, false, "should be equals");
};

