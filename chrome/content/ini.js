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

RSETB.INPUT_RATING_TOOL = "rsour_inputRatingTool";

RSETB.INPUT_RATING_STAR_CONTAINER = "rsour_inputStarsContainer";

RSETB.RATING_STARS = "rsour_stars";

RSETB.STEADINESS_TOOL = "rsour_steadinessTool";

RSETB.STEADINESS_IMAGE = "rsour_steadinessImage";

/**
 * @constant minimum value for an half star to be on (under this value is off)
 */
RSETB.MIN_VALUE_FOR_HALF_STAR = 0.25;

/**
 * @constant maximum value for an half star to be on (over this value is full)
 */
RSETB.MAX_VALUE_FOR_HALF_STAR = 0.75;


//initialize toolbar when all contents are loaded
/*window.addEventListener("load", function(){

    FBC.log("init");
    var toolbar = RSETB.toolbar();
    toolbar.init(debugMode);

}, false);*/


setTimeout(function(){

    FBC().log("init");
    RSETB.readersourcingExtension.initialize();

}, 1000);
