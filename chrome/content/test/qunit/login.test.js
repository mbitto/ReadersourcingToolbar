/**
 * Test module for RequestManager
 */

module('login', {

    setup : function(){
        this.result = 33;
        var self = this;
        this.reqManager = new RSETB.RequestManager("url", "POST", true);
        sinon.stub(this.reqManager, "request", function(params){
            self.result = [params.username, params.password];
        });
    },
    teardown: function(){
       this.reqManager.request.restore();
    }
});


test('Test params callback from modal window', function(){
    var login = RSETB.login(this.reqManager);
    login.modalOk("myUsername", "myPassword");

    deepEqual(this.result, ["myUsername", "myPassword"], "Username and Password")
    
});
