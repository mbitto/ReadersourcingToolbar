/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Readersourcing singleton
 */
RSETB.readersourcingExtension = {

    /**
     * Open new tab in browser
     *
     * @param destinationURL the URL of page that will be loaded when tab is open
     */
    openNewTab : function(destinationURL){
        //todo: check for -> gBrowser.loadOneTab("chrome://.../window.xul");
        gBrowser.selectedTab = gBrowser.addTab(destinationURL);
    },

    initialize : function(){

        var loginModal = RSETB.loginModal();
        var authentication = RSETB.authentication(loginModal);

        // Login tool of main menu
        var loginTool = new RSETB.Tool('login', RSETB.LOGIN_ENTRY);
        loginTool.registerUIEvent(function(){
            authentication.openLoginModal(loginModal);
        });

        // Logout tool of main menu
        var logoutTool = new RSETB.Tool('logout', RSETB.LOGOUT_ENTRY);
        logoutTool.registerUIEvent(function(){
            authentication.logout();
        });

        // Subscribe tools to authentication publications
        authentication.subscribe(logoutTool.setDisabled, false, "login");
        authentication.subscribe(logoutTool.setDisabled, true, "logout");
        authentication.subscribe(loginTool.setDisabled, true, "login");
        authentication.subscribe(loginTool.setDisabled, false, "logout");

        // Open user profile tool of main menu
        var userProfileTool = new RSETB.Tool('userProfile', RSETB.USER_PROFILE_ENTRY);
        userProfileTool.registerUIEvent( function(){
            this.openNewTab(RSETB.HOME_PAGE + "user/" + authentication.getUserId());
        });

        // Open home page
        var homePageTool = new RSETB.Tool('homePage', RSETB.READERSOURCING_HOMEPAGE_ENTRY);
        homePageTool.registerUIEvent( function(){
            this.openNewTab(RSETB.HOME_PAGE);
        });
    }
};