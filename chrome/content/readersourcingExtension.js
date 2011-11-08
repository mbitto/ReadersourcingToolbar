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
        gBrowser.selectedTab = gBrowser.addTab(destinationURL);
    },

    /**
     * Get url of the current tab
     */
    getCurrentUrl : function(){
        return getBrowser().mCurrentBrowser.currentURI.spec;
    },

    /**
     * Initialize the tools of toolbar
     */
    initialize : function(){

        var self = this;

        // Cache where recent results are saved
        var cache = RSETB.cache();

        // Login modal manager
        var loginModal = RSETB.loginModal();
        // Parse the XML response when a login request is made
        var loginResponseParser = new RSETB.LoginResponseParser();
        // Authentication manager
        var authentication = RSETB.authentication(loginResponseParser, loginModal);

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
        logoutTool.setDisabled();

        // Tool of main menu that opens user profile on RS
        var userProfileTool = new RSETB.Tool(RSETB.USER_PROFILE_ENTRY);
        userProfileTool.registerUIEvent( function(){
            self.openNewTab(RSETB.HOME_PAGE + "welcomeback/");
        });

        // Tool of main menu that opens home page of RS
        var homePageTool = new RSETB.Tool(RSETB.READERSOURCING_HOMEPAGE_ENTRY);
        homePageTool.registerUIEvent( function(){
            self.openNewTab(RSETB.HOME_PAGE);
        });

        // Input rating parser
        var getRatingResponseParser = new RSETB.GetRatingResponseParser();
        // Input rating manager
        var inputRating = RSETB.inputRating(getRatingResponseParser, cache);
        var inputRatingTool = new RSETB.InputRatingTool(RSETB.INPUT_RATING_TOOL);
        // Initialize all stars of inputRatingTool as switched off
        inputRatingTool.switchOff();

        var steadinessTool = new RSETB.SteadinessTool(RSETB.STEADINESS_TOOL);

        // Initialize as switched off
        steadinessTool.switchOff();

        var commentsTool = new RSETB.CommentsTool(RSETB.COMMENTS_TOOL_CONTAINER);
        commentsTool.setActiveElement(RSETB.COMMENTS_TOOL_LINK);
        // Register an event for active element of comments tool
        commentsTool.registerUIEvent(function(){
           self.openNewTab(RSETB.HOME_PAGE + "paper/id/" + inputRating.getPaperId());
        });

        // Initialize with no messages
        commentsTool.setNoComments();
        commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_OFF);

        // Tool for user that is not logged in
        var notLoggedInTool = new RSETB.Tool(RSETB.NOT_LOGGED_IN_TOOL);

        // Tool with a link for suggest a paper that is not in RS yet
        var suggestPaperTool = new RSETB.Tool("rsour_suggestPaperTool");
        suggestPaperTool.setActiveElement("rsour_suggestPaperLink");
        // Register an event for active element of suggest paper tool
        suggestPaperTool.registerUIEvent(function(){
            self.openNewTab(RSETB.HOME_PAGE + "suggestPaper/url/" + self.getCurrentUrl());
        });

        // Comment modal manager will open a modal that ask for a comment when user set a rating
        var commentModal = RSETB.commentModal();
        var setRatingResponseParser = new RSETB.SetRatingResponseParser();
        var outputRating = RSETB.outputRating(setRatingResponseParser, commentModal, cache);
        var outputRatingTool = new RSETB.OutputRatingTool(RSETB.OUTPUT_RATING_TOOL, inputRatingTool);
        outputRatingTool.registerUIEvent(function(){
            var rating = outputRatingTool.getRating();
            outputRating.sendRating(self.getCurrentUrl(), rating);
        });
        // Default display option for outputRating is hidden
        outputRatingTool.hide();

        // Tool that thank user for the rating expressed
        var thanksForRatingTool = new RSETB.Tool("rsour_thanksMessageWidget");
        thanksForRatingTool.hide();

        // Tool that inform user that current paper is already rated
        var paperAlreadyRatedTool = new RSETB.Tool("rsour_ratedMessageWidget");
        paperAlreadyRatedTool.hide();


        // Manages alert for new user's messages
        var messagesTool = new RSETB.Tool(RSETB.MESSAGES_TOOL);
        // Default main-tool-image for this tool
        messagesTool.setToolImage(RSETB.MESSAGE_IMAGE_INACTIVE);
        // Default tooltip
        // TODO: move this message to locale
        messagesTool.setToolTip("You have no messages");
        // Parse XML response of get-messages requests
        var messagesParser = new RSETB.GetMessagesResponseParser();
        var messages = RSETB.messages(messagesParser);
        messages.init();

        // Initialize browsingListener
        var browsingListener = RSETB.browsingListener();
        browsingListener.init();

        // Initialize downloadListener
        var downloadListener = RSETB.downloadListener();
        // Get firefox download manager service
        downloadListener.init();

        // Login user if last session was logged in
        authentication.autoLogin();

        // Subscribe tools to authentication publications
        authentication.subscribe(logoutTool.setEnabled, "login");
        authentication.subscribe(loginTool.setDisabled, "login");
        authentication.subscribe(notLoggedInTool.hide, "login");
        authentication.subscribe(messagesTool.show, "login");
        authentication.subscribe(outputRatingTool.show, "login");
        authentication.subscribe(logoutTool.setDisabled, "logout");
        authentication.subscribe(loginTool.setEnabled, "logout");
        authentication.subscribe(notLoggedInTool.show, "logout");
        authentication.subscribe(messagesTool.hide, "logout");
        authentication.subscribe(outputRatingTool.hide, "logout");

        browsingListener.subscribe(function(url){
            thanksForRatingTool.hide();
            paperAlreadyRatedTool.hide();
            setTimeout(function(){
                inputRating.requestRating(url);
            }, 600);
            outputRatingTool.relaseStars();
        }, "new-page");

        // Subscribe tools to input rating publications
        inputRating.subscribe(function(response){
            // Method called using *call* to preserve binding of *this* to inputRatingTool
            inputRatingTool.allStarsEmpty.call(inputRatingTool);
            inputRatingTool.setRating.call(inputRatingTool, response);
            steadinessTool.setSteadiness(response);
            commentsTool.setCommentsQty(response);
            commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_ON);
            suggestPaperTool.hide();
            if(authentication.isLoggedIn()){
                if(cache.isPaperRated(self.getCurrentUrl())){
                    outputRatingTool.hide();
                    paperAlreadyRatedTool.show();
                }
                else{
                    outputRatingTool.show();
                }
            }
            outputRating.setPaperName(response.title);
        }, "new-input-rating");

        inputRating.subscribe(function(){
            inputRatingTool.switchOff();
            steadinessTool.switchOff();
            commentsTool.setNoComments();
            commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_OFF);
            suggestPaperTool.show();
            outputRatingTool.hide();
        }, "no-input-rating");

        // Subscription for new messages
        messages.subscribe(function(response){
            messagesTool.setToolImage(RSETB.MESSAGE_IMAGE_ACTIVE);
            messagesTool.setToolTip("You have " + response.messagesQty + " messages");
        }, "new-messages");

        // Subscription for no new messages
        messages.subscribe(function(){
            messagesTool.setToolImage(RSETB.MESSAGE_IMAGE_INACTIVE);
            messagesTool.setToolTip("You have 0 messages");
        }, "no-new-messages");

        outputRating.subscribe(thanksForRatingTool.show, "new-input-rating");
        outputRating.subscribe(outputRatingTool.hide, "new-input-rating");
    }
};