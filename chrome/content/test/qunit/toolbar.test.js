/**
 * Test module for toolbar
 */

module('toolbar', {

    setup : function(){

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

test('Testing addTool function', function(){

    var aTool = new RSETB.Tool('testTool', 'xulElementStub');

    var myToolbar = RSETB.toolbar();
    myToolbar.init();
    myToolbar.addTool(aTool);

    deepEqual(myToolbar.getTool('testTool'), aTool, "Tools should be the same object");

});
