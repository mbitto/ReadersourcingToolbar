/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 27/09/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

RSETB.URL_TOOLBAR_REQUESTS = "http://www.readersourcing.maraspin.net/toolbar/";

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
