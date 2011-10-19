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

    var spyActivateLoginButton = sinon.spy();
    var spyActivateLogoutButton = sinon.spy();
    var spyDeactivateLoginButton = sinon.spy();
    var spyDeactivateLogoutButton = sinon.spy();


    authentication.subscribe(spyActivateLoginButton, "logout");
    authentication.subscribe(spyDeactivateLoginButton, "login");
    authentication.subscribe(spyActivateLogoutButton, "login");
    authentication.subscribe(spyDeactivateLogoutButton, "logout");

    authentication.publish("login");

    ok(spyDeactivateLoginButton.calledWith(), 'Login button deactivated after login');
    ok(spyActivateLogoutButton.calledWith(), 'Logout button activated after login');
    
    authentication.publish("logout");

    ok(spyActivateLoginButton.calledWith(), 'Login button activated after logout');
    ok(spyDeactivateLogoutButton.calledWith(), 'Logout button deactivated after logout');
});