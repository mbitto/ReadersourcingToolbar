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

        // Subscribe tools to authentication publications
        authentication.subscribe(logoutTool.setEnabled, "login");
        authentication.subscribe(loginTool.setDisabled, "login");
        authentication.subscribe(logoutTool.setDisabled, "logout");
        authentication.subscribe(loginTool.setEnabled, "logout");

        // Tool of main menu that opens user profile on RS
        var userProfileTool = new RSETB.Tool(RSETB.USER_PROFILE_ENTRY);
        userProfileTool.registerUIEvent( function(){
            // FIXME: authentication.getUserId() doesn't exist
            self.openNewTab(RSETB.HOME_PAGE + "user/" + authentication.getUserId());
        });

        // Tool of main menu that opens home page of RS
        var homePageTool = new RSETB.Tool(RSETB.READERSOURCING_HOMEPAGE_ENTRY);
        homePageTool.registerUIEvent( function(){
            self.openNewTab(RSETB.HOME_PAGE);
        });

        // Input rating parser
        var ratingResponseParser = new RSETB.RatingResponseParser();
        // Input rating manager
        var inputRating = RSETB.inputRating(ratingResponseParser);
        var inputRatingTool = new RSETB.InputRatingTool(RSETB.INPUT_RATING_TOOL);
        // Initialize all stars of inputRatingTool as switched off
        inputRatingTool.switchOff();

        var steadinessTool = new RSETB.SteadinessTool(RSETB.STEADINESS_TOOL);

        var commentsTool = new RSETB.CommentsTool(RSETB.COMMENTS_TOOL_CONTAINER);
        commentsTool.setActiveElement(RSETB.COMMENTS_TOOL_LINK);
        // Register an event for active element of comments tool
        commentsTool.registerUIEvent(function(){
           self.openNewTab(RSETB.HOME_PAGE + "paper/id/" + inputRating.getPaperId());
        });
        // Initialize with no messages
        commentsTool.setNoComments();
        commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_OFF);

        // Subscribe tools to input rating publications
        inputRating.subscribe(function(response){
            // Method called using *call* to preserve binding of *this* tp inputRatingTool
            FBC().log(response);
            inputRatingTool.allStarsEmpty.call(inputRatingTool);
            inputRatingTool.setRating.call(inputRatingTool, response);
            steadinessTool.setSteadiness(response);
            commentsTool.setCommentsQty(response);
            commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_ON);
        }, "new-input-rating");

        inputRating.subscribe(function(){
            inputRatingTool.switchOff();
            steadinessTool.switchOff();
            commentsTool.setNoComments();
            commentsTool.setToolImage(RSETB.COMMENTS_IMAGE_OFF);
        }, "no-input-rating");

        var suggestPaperTool = new RSETB.Tool("rsour_suggestPaperTool");
        suggestPaperTool.setActiveElement("rsour_suggestPaperLink");
        // Register an event for active element of suggest paper tool
        suggestPaperTool.registerUIEvent(function(){
            self.openNewTab(RSETB.HOME_PAGE + "suggestPaper/url/" + self.getCurrentUrl());
        });

        // Comment modal manager will open a modal that ask for a comment when user set a rating
        var commentModal = RSETB.commentModal();
        var outputRating = RSETB.outputRating(ratingResponseParser, commentModal);
        var outputRatingTool = new RSETB.OutputRatingTool(RSETB.OUTPUT_RATING_TOOL, inputRatingTool);
        outputRatingTool.registerUIEvent(function(){
            var rating = outputRatingTool.getRating();
            outputRating.sendRating(self.getCurrentUrl(), rating);
        });
        // Default display option for outputRating is false
        outputRatingTool.show(true);

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
        // Subscription for new messages
        messages.subscribe(function(response){
            messagesTool.setToolImage(RSETB.MESSAGE_IMAGE_ACTIVE);
            messagesTool.setToolTip("You have " + response.messageQty + " messages");
        }, "new-messages");
        // Subscription for no new messages
        messages.subscribe(function(){
            messagesTool.setToolImage(RSETB.MESSAGE_IMAGE_INACTIVE);
            messagesTool.setToolTip("You have 0 messages");
        }, "no-new-messages");

        // Initialize browsingListener
        var browsingListener = RSETB.browsingListener(inputRating);
        browsingListener.init();

        // Initialize downloadListener
        var downloadListener = RSETB.downloadListener();
        // Get firefox download manager service
        downloadListener.init();

        // Login user if last session was logged in
        authentication.autoLogin();


        // TODO: delete me
        var test = new RSETB.Tool("rsour_test");
        test.registerUIEvent(function(){
            outputRating.openCommentModal();
        });
        test.setInfoToolTip("Test value is: 10", "Modern technologies and globalization have in fact provided several advantages to scientific writing, but they do not help the peer reviewing process to the same extent, finally unbalancing the existing equilibrium between scientific writers and reviewers");

    }
};