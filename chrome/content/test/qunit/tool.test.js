/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 29/09/11
 */

/**
 * Test module for Tool object
 */
module('Tool', {
    setup: function(){
        this.xulElementStub = {
            disabled : true,
            id : "xulElementStub",
            simulateClick : null,
            addEventListener : function(){
                this.simulateClick = arguments[1];
            },
            getElementsByClassName : function(){
                return {};
            }
        };
        this.getElementByIdStub = sinon.stub(document, "getElementById");
        this.getElementByIdStub.withArgs('xulElementStub').returns(this.xulElementStub);
    },

    teardown: function(){
        this.getElementByIdStub.restore();
    }
});

test('Register callback and test it', function(){

    var callbackResult = null;
    var callback = function(event){
          callbackResult = "called with event: " + event;
    };
    var generateError = function(){
        tool.registerUIEvent(callback, "another one");
    };
    var tool = new RSETB.Tool('xulElementStub');

    tool.registerUIEvent(function(event, args){
        callback(event, args);
    });

    this.xulElementStub.simulateClick('anEvent');

    equal(callbackResult, "called with event: anEvent", "Result of executeCallback function");
    raises(generateError, "Callback function is already defined for testTool tool", "Cannot register more than one callback function");

});

test('Disable tool', function(){


    var callbackResult = null;
    var callback = function(event, args){
          callbackResult = "called with event: " + event;
    };
    var generateError = function(){
        tool.registerUIEvent(callback, "another one");
    };
    var tool = new RSETB.Tool('xulElementStub');

    tool.registerUIEvent(function(event, args){
        callback(event, args);
    });

    this.xulElementStub.simulateClick('anEvent');
    equal(callbackResult, "called with event: anEvent", "Result of executeCallback function");

    callbackResult = null;

    tool.setDisabled();
    this.xulElementStub.simulateClick('anEvent');
    equal(tool.getDisabledState(), true, "Tool state should be disabled");
    equal(callbackResult, null, "No callback should has been called");

    tool.setEnabled();
    this.xulElementStub.simulateClick('anEvent');
    equal(tool.getDisabledState(), false, "Tool state shouldn't be disabled");
    equal(callbackResult, "called with event: anEvent", "Result of executeCallback");

});