/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 30/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

RSETB.NotificationBox = function(message, destinationURL){
    var nb = gBrowser.getNotificationBox();

    var buttonsToShow = [];

    var closeButton = {};
    var goToURLButton = {};

    // TODO: export messages in locale
    if(typeof destinationURL !== "undefined"){
        goToURLButton.label = "Go to Readersourcing.org";
        goToURLButton.popup = null;
        goToURLButton.accessKey = "g";
        goToURLButton.callback = function(){
            gBrowser.selectedTab = gBrowser.addTab(destinationURL);
        };
        buttonsToShow.push(goToURLButton);
    }

    closeButton.label = "Close this Message";
    closeButton.accessKey = "c";
    closeButton.popup = null;
    closeButton.callback = function(){
        nb.removeCurrentNotification();
    };
    buttonsToShow.push(closeButton);

    nb.appendNotification(
        message, 'readersourcing-notification',
        "chrome://readersourcingToolbar/skin/alert.png",
        nb.PRIORITY_WARNING_MEDIUM, buttonsToShow
    );
};