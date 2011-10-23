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

        // Initialize browsingListener
        var browsingListener = RSETB.browsingListener();
        browsingListener.init();

        // Initialize downloadListener
        var downloadListener = RSETB.downloadListener();
        downloadListener.init();

        var loginModal = RSETB.loginModal();
        var authentication = RSETB.authentication(loginModal);

        // Login tool of main menu
        var loginTool = new RSETB.Tool(RSETB.LOGIN_ENTRY);
        loginTool.registerUIEvent(function(){
            authentication.openLoginModal(loginModal);
        });

        // Logout tool of main menu
        var logoutTool = new RSETB.Tool(RSETB.LOGOUT_ENTRY);
        logoutTool.registerUIEvent(function(){
            authentication.logout();
        });

        // Subscribe tools to authentication publications
        authentication.subscribe(logoutTool.setEnabled, "login");
        authentication.subscribe(logoutTool.setDisabled, "logout");
        authentication.subscribe(loginTool.setDisabled, "login");
        authentication.subscribe(loginTool.setEnabled, "logout");

        // Open user profile tool of main menu
        var userProfileTool = new RSETB.Tool(RSETB.USER_PROFILE_ENTRY);
        userProfileTool.registerUIEvent( function(){
            this.openNewTab(RSETB.HOME_PAGE + "user/" + authentication.getUserId());
        });

        // Open home page
        var homePageTool = new RSETB.Tool(RSETB.READERSOURCING_HOMEPAGE_ENTRY);
        homePageTool.registerUIEvent( function(){
            this.openNewTab(RSETB.HOME_PAGE);
        });

        var inputRating = RSETB.inputRating();

        // Input rating stars tool
        var inputRatingTool = new RSETB.InputRatingTool(RSETB.INPUT_RATING_TOOL);
        inputRating.subscribe(inputRatingTool.request, "rating");
        inputRating.subscribe(inputRatingTool.request, "no-rating");

        inputRatingTool.setRating(3.336565656);

        var steadinessTool = new RSETB.SteadinessTool(RSETB.STEADINESS_TOOL);

        inputRating.subscribe(steadinessTool.setSteadiness, "steadiness");
        inputRating.subscribe(steadinessTool.switchOff, "no-steadiness");

        var outputRatingTool = new RSETB.OutputRatingTool(RSETB.OUTPUT_RATING_TOOL, inputRatingTool);
        outputRatingTool.registerUIEvent(function(rating){
            FBC().log("called with: " + rating);
            //outputRating.setRating();
        });
        outputRatingTool.setDisabled(false);

    }
};