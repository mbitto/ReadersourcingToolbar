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
 * @constant Parameter for login requests
 */
RSETB.URL_REQUESTS_LOGIN = RSETB.URL_REQUESTS + "login";

/**
 * @constant Parameter for logout requests
 */
RSETB.URL_REQUESTS_LOGOUT = RSETB.URL_REQUESTS + "logout";

/**
 * @constant Parameter for get pdf paper requests
 */
RSETB.URL_GET_PAPER_PDF = RSETB.URL_REQUESTS + "get-paper-pdf";

/**
 * @constant Parameter for get pdf paper requests
 */
RSETB.URL_GET_PAPER_VOTE = RSETB.URL_REQUESTS + "get-paper-vote";

/**
 * @constant Parameter for set vote to an existing paper
 */
RSETB.URL_SET_PAPER_VOTE = RSETB.URL_REQUESTS + "set-paper-vote";

/**
 * @constant Readersourcing Homepage
 */
RSETB.HOME_PAGE = 'www.readersourcing.org/';

/**
 * @constant Readersourcing page for password reset
 */
RSETB.PASSWORD_RESET_PAGE = RSETB.HOME_PAGE + 'resetPassword/';

/**
 * @constant Readersourcing registration page
 */
RSETB.REGISTRATION_PAGE = RSETB.HOME_PAGE  + 'register/';

/**
 * @constant Login modal window path
 */
RSETB.LOGIN_MODAL ="chrome://readersourcingToolbar/content/loginModal.xul";

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
 * @constant id of xul element test button
 */
RSETB.FIREUNIT_TEST_BUTTON = "rsour_fireUnit",

/**
 * @constant id name of xul element main menu
 */
RSETB.MAIN_MENU_BUTTON = "rsour_mainMenu",

/**
 * @constant id name of xul element login
 */
RSETB.LOGIN_ENTRY = "rsour_login",

/**
 * @constant id name of xul element logout
 */
RSETB.LOGOUT_ENTRY = "rsour_logout",

/**
 * @constant id name of xul element user profile
 */
RSETB.USER_PROFILE_ENTRY = "rsour_user_profile",

/**
 * @constant Readersourcing homepage
 */
RSETB.READERSOURCING_HOMEPAGE_ENTRY = "rsour_homepage";

/**
 * @constant username field on login modal window
 */
RSETB.MODAL_USERNAME_FIELD = "rsour_loginModalUsername";

/**
 * @constant password field on login modal window
 */
RSETB.MODAL_PASSWORD_FIELD = "rsour_loginModalPassword";

/**
 * @constant description text on login modal window
 */
RSETB.MODAL_DESCRIPTION_TEXT = "rsour_loginModalDescription";

/**
 * @constant link to forgot password page present in login modal window
 */
RSETB.MODAL_FORGOT_PASSWORD_LINK = "rsour_modalForgotPassword";

/**
 * @constant link to register new user present in login modal window
 */
RSETB.MODAL_REGISTER_LINK = "rsour_modalRegisterNewUser";

/**
 * @constant id name of xul element container of input rating tool
 */
RSETB.INPUT_RATING_TOOL = "rsour_inputRatingTool";

/**
 * @constant id name of xul element container of input rating stars
 */
RSETB.INPUT_RATING_STAR_CONTAINER = "rsour_inputStarsContainer";

/**
 * @constant class name of stars xul elements
 */
RSETB.RATING_STARS = "rsour_stars";

/**
 * @constant id name of steadiness tool container
 */
RSETB.STEADINESS_TOOL = "rsour_steadinessTool";

/**
 * @constant id name of xul steadiness image
 */
RSETB.STEADINESS_IMAGE = "rsour_steadinessImage";

/**
 * @constant id name of xul steadiness image
 */
RSETB.COMMENTS_TOOL_CONTAINER = "rsour_commentsTool";

/**
 * @constant id name of xul steadiness image
 */
RSETB.COMMENTS_TOOL_LINK = "rsour_commentsLink";

/**
 * @constant id name of xul container for output rating tool
 */
RSETB.OUTPUT_RATING_TOOL = "rsour_outputRatingTool";

/**
 * @constant id name of xul stars container for output rating tool
 */
RSETB.OUTPUT_RATING_STARS_CONTAINER = "rsour_outputStarsContainer";

/**
 * @constant id name of xul submit button for output rating tool
 */
RSETB.OUTPUT_RATING_SUBMIT_BUTTON = "rsour_submitOutputRating";

/**
 * @constant minimum value for an half star to be on (under this value is off)
 */
RSETB.MIN_VALUE_FOR_HALF_STAR = 0.26;

/**
 * @constant maximum value for an half star to be on (over this value is full)
 */
RSETB.MAX_VALUE_FOR_HALF_STAR = 0.75;

/**
 * @constant default time to clear cache
 */
RSETB.CLEAR_CACHE_DEFAULT_TIME = 60;

/**
 * @constant maximum default number of paper allowed in cache
 */
RSETB.MAX_PAPER_IN_CACHE = 100;


// Initialize toolbar when all contents are loaded
/*window.addEventListener("load", function(){

    FBC.log("init");
    var toolbar = RSETB.toolbar();
    toolbar.init(debugMode);

}, false);*/


setTimeout(function(){

    FBC().log("init");
    RSETB.readersourcingExtension.initialize();

}, 2000);
