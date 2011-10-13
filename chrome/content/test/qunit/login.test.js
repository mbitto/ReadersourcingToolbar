/**
 * Test module for RequestManager
 */

module('login', {

    setup : function(){
    },
    teardown: function(){

    }

});


test('Test params callback from modal window', function(){

    var reqManager = new RSETB.RequestManager("url", "POST", true);
    var mockReqManager = sinon.mock(reqManager);
    var myLogin = RSETB.login(reqManager);

    var params = {
        username : "myUsername",
        password : "myPassword"
    };

    mockReqManager.expects("request").withArgs(params);

    myLogin.modalOk("myUsername", "myPassword");

    ok(mockReqManager.verify(), "Array of params callback from modal window");
    mockReqManager.restore();
    
});