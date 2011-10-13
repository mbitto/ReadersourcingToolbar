/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

// Readersourcing singleton
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
        // Initialize toolbar
        var toolbar = RSETB.toolbar();
        toolbar.init();

        var loginModal = RSETB.loginModal();
        var login = RSETB.login(loginModal);

        // Create a new object menu and add properties for mainMenu
        var menuTool = new RSETB.Tool('mainMenu', RSETB.MAIN_MENU_BUTTON);
        toolbar.addTool(menuTool);

        var loginTool = new RSETB.Tool('login', RSETB.LOGIN_ENTRY);
        toolbar.addTool(loginTool, function(){ login.openLoginModal() });

        var logoutTool = new RSETB.Tool('logout', RSETB.LOGOUT_ENTRY);
        toolbar.addTool(logoutTool, function(){ login.logout() });

        var userProfileTool = new RSETB.Tool('userProfile', RSETB.USER_PROFILE_ENTRY);
        toolbar.addTool(userProfileTool, function(){
            this.openNewTab(RSETB.HOME_PAGE + "user/" + login.getUserId() );
        });

        var homePageTool = new RSETB.Tool('homePage', RSETB.READERSOURCING_HOMEPAGE_ENTRY);
        toolbar.addTool(homePageTool, function(){
            this.openNewTab(RSETB.HOME_PAGE);
        });
    }
};