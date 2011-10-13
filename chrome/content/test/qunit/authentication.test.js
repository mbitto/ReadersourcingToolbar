/**
 * Test module for RequestManager
 */

module('authentication', {

    setup : function(){
    },
    teardown: function(){
    }

});


test('Test acquired methods of Publisher ', function(){

    var authentication = RSETB.authentication();

    var spyDummyLoginButton = sinon.spy();
    var spyDummyLogoutButton = sinon.spy();


    authentication.subscribe(spyDummyLoginButton, true, "login");
    authentication.subscribe(spyDummyLogoutButton, false, "login");

    authentication.publish("login");

    console.log(spyDummyLoginButton.called);

    ok(spyDummyLoginButton.calledWith(true), 'Login button deactivated after login');
    ok(spyDummyLogoutButton.calledWith(false), 'Login button activated after login');


    authentication.subscribe(spyDummyLogoutButton, true, "logout");
    authentication.subscribe(spyDummyLoginButton, false, "logout");
    
    authentication.publish("logout");

    ok(spyDummyLogoutButton.calledWith(true), 'Logout button deactivated after logout');
    ok(spyDummyLoginButton.calledWith(false), 'Login button activated after logout');
});