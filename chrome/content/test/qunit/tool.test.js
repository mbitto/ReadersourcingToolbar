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
            }
        };
        this.getElementByIdStub = sinon.stub(document, "getElementById");
        this.getElementByIdStub.withArgs('xulElementStub').returns(this.xulElementStub);
    },

    teardown: function(){
        this.getElementByIdStub.restore();
    }
});

test('Get name and id', function(){
    var tool = new RSETB.Tool('xulElementStub');
    equal(tool.getXulElementId(), 'xulElementStub', "Tool id should be xulElementStub");
});

test('Register callback and test it', function(){

    var callbackResult = null;
    var callback = function(event, args){
          callbackResult = "called with: " + event + ", " + args[0] + ' and ' + args[1];
    };
    var generateError = function(){
        tool.registerUIEvent(callback, "another one");
    };
    var tool = new RSETB.Tool('xulElementStub');

    tool.registerUIEvent(function(event, args){
        callback(event, args);
    });

    this.xulElementStub.simulateClick('anEvent', 'test1', 'test2');

    equal(callbackResult, "called with: anEvent, test1 and test2", "Result of executeCallback function must include 2 params");
    raises(generateError, "Callback function is already defined for testTool tool", "Cannot register more than one callback function");

});

test('Disable tool', function(){
    var tool = new RSETB.Tool('xulElementStub');
    tool.setDisabled();
    equal(tool.getDisabledState(), true, "Tool state should be disabled");
    tool.setEnabled();
    equal(tool.getDisabledState(), false, "Tool state shouldn't be disabled");

});