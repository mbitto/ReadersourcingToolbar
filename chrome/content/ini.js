/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 27/09/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * @constant Readersourcing url for toolbar requests
 */
RSETB.URL_REQUESTS = "http://www.readersourcing.maraspin.net/toolbar/";

/**
 * @constant Readersourcing Homepage
 */
RSETB.HOME_PAGE = 'www.readersourcing.org/';

/**
 * @constant URL parameter for login requests
 */
RSETB.URL_REQUESTS_LOGIN = RSETB.URL_REQUESTS + "login";

/**
 * @constant URL parameter for logout requests
 */
RSETB.URL_REQUESTS_LOGOUT = RSETB.URL_REQUESTS + "logout";

/**
 * @constant URL parameter to get pdf paper requests
 */
RSETB.URL_GET_PAPER_PDF = RSETB.URL_REQUESTS + "get-paper-pdf";

/**
 * @constant URL parameter to get pdf paper requests
 */
RSETB.URL_GET_PAPER_VOTE = RSETB.URL_REQUESTS + "get-paper-vote";

/**
 * @constant URL parameter to set vote to an existing paper
 */
RSETB.URL_SET_PAPER_VOTE = RSETB.URL_REQUESTS + "set-paper-vote";

/**
 * @constant URL parameter to get user messages qty
 */
RSETB.URL_REQUESTS_MESSAGES = RSETB.URL_REQUESTS + "get-msg";

/**
 * @constant Readersourcing page for password reset
 */
RSETB.PASSWORD_RESET_PAGE = RSETB.HOME_PAGE + 'resetPassword/';

/**
 * @constant Readersourcing registration page
 */
RSETB.REGISTRATION_PAGE = RSETB.HOME_PAGE  + 'register/';

/**
 * @constant Fake uri used by extension to store some information in firefox
 */
RSETB.STORAGE_URI ="http://readersourcing.extension.toolbar.storage";

/**
 * @constant Login modal window path
 */
RSETB.LOGIN_MODAL ="chrome://readersourcingToolbar/content/loginModal.xul";

/**
 * @constant Add messages modal window path
 */
RSETB.COMMENT_MODAL ="chrome://readersourcingToolbar/content/commentModal.xul";

/**
 * @constant Image reference of switched off star
 */
RSETB.RATING_STAR_OFF = "chrome://readersourcingToolbar/skin/star0.png";

/**
 * @constant Image reference of empty star
 */
RSETB.RATING_STAR_EMPTY = "chrome://readersourcingToolbar/skin/star1.png";

/**
 * @constant Image reference of half star
 */
RSETB.RATING_STAR_HALF = "chrome://readersourcingToolbar/skin/star2.png";

/**
 * @constant Image reference of full star
 */
RSETB.RATING_STAR_ON = "chrome://readersourcingToolbar/skin/star3.png";

/**
 * @constant chrome address of empty steadiness image
 */
RSETB.STEADINESS_OFF = "chrome://readersourcingToolbar/skin/ste0.png";

/**
 * @constant chrome address of level 1 steadiness image
 */
RSETB.STEADINESS_VALUE_1 = "chrome://readersourcingToolbar/skin/ste1.png";

/**
 * @constant chrome address of level 2 steadiness image
 */
RSETB.STEADINESS_VALUE_2 = "chrome://readersourcingToolbar/skin/ste2.png";

/**
 * @constant chrome address of level 3 steadiness image
 */
RSETB.STEADINESS_VALUE_3 = "chrome://readersourcingToolbar/skin/ste3.png";

/**
 * @constant chrome address of submit button confirmation image
 */
RSETB.OUTPUT_RATING_SUBMIT_IMAGE_ON = "chrome://readersourcingToolbar/skin/confirmOn.png";

/**
 * @constant chrome address of submit button confirmation image
 */
RSETB.OUTPUT_RATING_SUBMIT_IMAGE_OFF = "chrome://readersourcingToolbar/skin/confirmOff.png";

/**
 * @constant Image path for message active button
 */
RSETB.MESSAGE_IMAGE_ACTIVE = "chrome://readersourcingToolbar/skin/messageOn.png";

/**
 * @constant Image path for message inactive button
 */
RSETB.MESSAGE_IMAGE_INACTIVE = "chrome://readersourcingToolbar/skin/messageOff.png";

/**
 * @constant Image path for comments on image
 */
RSETB.COMMENTS_IMAGE_ON = "chrome://readersourcingToolbar/skin/commentsOn.png";

/**
 * @constant Image path for comments off image
 */
RSETB.COMMENTS_IMAGE_OFF = "chrome://readersourcingToolbar/skin/commentsOff.png";

/**
 * @constant Id of xul element test button
 */
RSETB.FIREUNIT_TEST_BUTTON = "rsour_fireUnit",

/**
 * @constant Id name of xul element main menu
 */
RSETB.MAIN_MENU_BUTTON = "rsour_mainMenu",

/**
 * @constant Id name of xul element login
 */
RSETB.LOGIN_ENTRY = "rsour_login",

/**
 * @constant Id name of xul element logout
 */
RSETB.LOGOUT_ENTRY = "rsour_logout",

/**
 * @constant Id name of xul element user profile
 */
RSETB.USER_PROFILE_ENTRY = "rsour_user_profile",

/**
 * @constant Readersourcing homepage
 */
RSETB.READERSOURCING_HOMEPAGE_ENTRY = "rsour_homepage";

/**
 * @constant Username field on login modal window
 */
RSETB.MODAL_USERNAME_FIELD = "rsour_loginModalUsername";

/**
 * @constant Password field on login modal window
 */
RSETB.MODAL_PASSWORD_FIELD = "rsour_loginModalPassword";

/**
 * @constant Description text on login modal window
 */
RSETB.MODAL_DESCRIPTION_TEXT = "rsour_loginModalDescription";

/**
 * @constant Link to forgot password page present in login modal window
 */
RSETB.MODAL_FORGOT_PASSWORD_LINK = "rsour_modalForgotPassword";

/**
 * @constant Link to register new user present in login modal window
 */
RSETB.MODAL_REGISTER_LINK = "rsour_modalRegisterNewUser";

/**
 * @constant Text Description of comment modal
 */
RSETB.MODAL_COMMENT_DESCRIPTION_TEXT = "rsour_commentModalDescription";

/**
 * @constant Text field of comment modal
 */
RSETB.MODAL_COMMENT_FIELD = "rsour_commentModalTextbox";

/**
 * @constant Id name of xul element container of input rating tool
 */
RSETB.INPUT_RATING_TOOL = "rsour_inputRatingTool";

/**
 * @constant Id name of xul element container of input rating stars
 */
RSETB.INPUT_RATING_STAR_CONTAINER = "rsour_inputStarsContainer";

/**
 * @constant class name of stars xul elements
 */
RSETB.RATING_STARS = "rsour_stars";

/**
 * @constant Id name of steadiness tool container
 */
RSETB.STEADINESS_TOOL = "rsour_steadinessTool";

/**
 * @constant Id name of xul steadiness image
 */
RSETB.STEADINESS_IMAGE = "rsour_steadinessImage";

/**
 * @constant Id name of xul comments container
 */
RSETB.COMMENTS_TOOL_CONTAINER = "rsour_commentsTool";

/**
 * @constant Id name of xul comments link
 */
RSETB.COMMENTS_TOOL_LINK = "rsour_commentsLink";

/**
 * @constant Id name of xul container for output rating tool
 */
RSETB.OUTPUT_RATING_TOOL = "rsour_outputRatingTool";

/**
 * @constant Id name of xul stars container for output rating tool
 */
RSETB.OUTPUT_RATING_STARS_CONTAINER = "rsour_outputStarsContainer";

/**
 * @constant Id name of xul submit button for output rating tool
 */
RSETB.OUTPUT_RATING_SUBMIT_BUTTON = "rsour_submitOutputRating";

/**
 * @constant Id name of xul messages button
 */
RSETB.MESSAGES_TOOL = "rsour_messagesTool";

/**
 * @constant Minimum value for an half star to be on (under this value is off)
 */
RSETB.MIN_VALUE_FOR_HALF_STAR = 0.26;

/**
 * @constant Maximum value for an half star to be on (over this value is full)
 */
RSETB.MAX_VALUE_FOR_HALF_STAR = 0.75;

/**
 * @constant Default time to clear cache
 */
RSETB.CLEAR_CACHE_DEFAULT_TIME = 60;

/**
 * @constant Maximum default number of paper allowed in cache
 */
RSETB.MAX_PAPER_IN_CACHE = 100;

/**
 * @constant Default time to check for new messages
 */
RSETB.CHECK_FOR_MESSAGES_DEFAULT_TIME = 3;


// Initialize toolbar when all contents are loaded
/*window.addEventListener("load", function(){

    FBC.log("init");
    RSETB.readersourcingExtension.initialize();

}, false);*/


setTimeout(function(){

    FBC().log("init");
    RSETB.readersourcingExtension.initialize();

}, 2000);
