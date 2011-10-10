
/**
 * Modal window options
 */
var windowFeatures = "centerscreen,chrome,modal";

/**
 * Modal window extra params
 */
var extraParams = "";

/**
 * Open the modal window
 */
var openLoginModalWindow = function(){
    window.openDialog("www.example.com", "loginModal", windowFeatures, extraParams);
};

var loginFunc = function(){
    openLoginModalWindow();
};

var logoutFunc = function(){
    alert("logout");
};

