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
        this.getElementByIdStub.returns(this.xulElementStub);

    },
    teardown: function(){
        this.getElementByIdStub.restore();
    }
});

test('Get name and id', function(){
    var tool = new RSETB.Tool('testTool', 'xulElementStub');

    equal(tool.getName(), 'testTool', "Tool namme should be testTool");
    equal(tool.getXulElementId(), 'xulElementStub', "Tool id should be xulElementStub");

});

test('Register callback and test it', function(){

    var callbackResult = null;

    var callback = function(param1, param2){
          callbackResult = "called with params: " + param1 + " and " + param2;
    };

    var generateError = function(){
        tool.registerCallback(callback, "another one");
    };

    var tool = new RSETB.Tool('testTool', 'xulElementStub');

    tool.registerCallback(callback, "firstParam", "secondParam");

    this.xulElementStub.simulateClick();

    equal(callbackResult, "called with params: firstParam and secondParam", "Result of executeCallback function must include 2 params");
    raises(generateError, "Callback function is already defined for testTool tool", "Cannot register more than one callback function");

});

test('Disable button', function(){
    var tool = new RSETB.Tool('testTool', 'xulElementStub');

    tool.setDisabled(true);
    equal(tool.getDisabledState(), true, "Tool state should be disabled");
    tool.setDisabled(false);
    equal(tool.getDisabledState(), false, "Tool state shouldn't be disabled");

});