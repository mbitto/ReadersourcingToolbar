/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 07/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};


/**
 * Object that manages authentication and logout to the server and store username and password on user's profile
 *
 * @param loginResponseParser parser for received xml response
 * @param loginModal modal window to login
 */
RSETB.authentication = function(loginResponseParser, loginModal){

    // Get publisher methods
    var publisher = new MBJSL.Publisher();

    /**
     * Get LoginInfo interface
     */
    var getLoginInfoInterface = function(){
        return new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                        Components.interfaces.nsILoginInfo);
    };

    /**
     * Get password manager interface
     */
    var getPasswordManager = function(){
        return Components.classes["@mozilla.org/login-manager;1"].
            getService(Components.interfaces.nsILoginManager);
    };

    /**
     * Get local storage interfaces
     */
    var getLocalStorageInterface = function(){
        var ios = Components.classes["@mozilla.org/network/io-service;1"]
              .getService(Components.interfaces.nsIIOService);
        var ssm = Components.classes["@mozilla.org/scriptsecuritymanager;1"]
              .getService(Components.interfaces.nsIScriptSecurityManager);
        var dsm = Components.classes["@mozilla.org/dom/storagemanager;1"]
              .getService(Components.interfaces.nsIDOMStorageManager);

        var uri = ios.newURI(RSETB.STORAGE_URI, "", null);
        var principal = ssm.getCodebasePrincipal(uri);
        return dsm.getLocalStorageForPrincipal(principal, "");
    };

    /**
     * Get last session login status
     */
    var isLoggedIn = function(){
        var storage = getLocalStorageInterface();
        var loggedIn = storage.getItem("RSETB_loggedIn");
        FBC().log("is logged in : " + (loggedIn !== null && loggedIn !== false));
        return loggedIn !== null && loggedIn !== false;
    };

    /**
     * Save login status to true for next session
     */
    var setLoggedIn = function(){
        var storage = getLocalStorageInterface();
        storage.setItem("RSETB_loggedIn", true);
        FBC().log("loggedIn set to: " + true);
    };

    /**
     * Save login status to false for next session
     */
    var setNotLoggedIn = function(){
        var storage = getLocalStorageInterface();
        storage.removeItem("RSETB_loggedIn", false);
        FBC().log("loggedIn set to: " + false);
    };

    /**
     * Save last used username locally
     *
     * @param username
     */
    var saveUsername = function(username){
        var storage = getLocalStorageInterface();
        storage.setItem("RSETB_username", username);
        FBC().log("saved username: " + username);
    };

    /**
     * Get the last saved username
     */
    var getLastSavedUsername = function(){
        var storage = getLocalStorageInterface();
        var username = storage.getItem("RSETB_username");
        FBC().log("username retrieved: " + username);
        return username;
    };

    /**
     * Store the last password used for a specific username
     * 
     * @param username
     * @param password
     */
    var storePassword = function(username, password){

        var nsLoginInfo = getLoginInfoInterface();
        var userLogin = new nsLoginInfo;
        userLogin.QueryInterface(Ci.nsILoginMetaInfo);
        userLogin.init(RSETB.STORAGE_URI, "", null, username, password, "", "");

        var existentLogin = retrieveLogin(username);

        var passwordManager = getPasswordManager();

        // New password for this username
        if (null === existentLogin){
            passwordManager.addLogin(userLogin);
            FBC().log("stored password: "  + password);
        }
        // Change password for this username
        else if(existentLogin.password !== password){
            // TODO: test this!!!
            passwordManager.modifyLogin(existentLogin, userLogin);
        }
        // Password is already stored, nothing else to do
    };

    /**
     * Retrieve password given a username string
     *
     * @param username
     */
    var retrieveLogin = function(username){
        try {
            // Find users for the given parameters
            var passwordManager = getPasswordManager();
            var logins = passwordManager.findLogins({}, RSETB.STORAGE_URI, "", null);

            // Find user from returned array of nsILoginInfo objects
            for (var i = 0; i < logins.length; i++) {
                if (logins[i].username == username) {
                    FBC().log("retrieved password: " + logins[i].password);
                    return logins[i];
                }
            }
            return null;
        }
        catch(ex) {
            // TODO: manage this exception
            FBC().log(ex);
           // This will only happen if there is no nsILoginManager component class
        }
    };

    /**
     * Callback function passed to the modal window
     *
     * @param username username received from modal window
     * @param password password received from modal window
     */
    var sendUserParams = function(username, password){
        
        var requestManager = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGIN, 'POST', true);

        requestManager.request(
            // Params of request
            {
                username : username,
                password: password
            },

            // Successful request callback
            function(doc){
                loginResponseParser.setDocument(doc, 'login');
                // Parse XML document
                try{
                    var outcome = loginResponseParser.getOutcome();
                    var response = loginResponseParser.checkResponse();
                }catch(error){
                    loginModal.badXMLRequest(error);
                }

                if(outcome == "ok"){
                    loginModal.successfulLogin(response);
                    loginModal.closeModal(1000);
                    publisher.publish("login");
                    saveUsername(username);
                    storePassword(username,password);
                    setLoggedIn();
                    // TODO: gestire i messaggi e i rating tools
                }else{
                    loginModal.failedLogin(response);
                }
            },

            // Failed request callback
            function(error){
                loginModal.failedRequest(error);
            }
        );
    };

    /**
     * Open modal window to login. If fields are complete, send params to server
     *
     */
    publisher.openLoginModal = function(){

        // Modal window options
        var windowFeatures = "centerscreen, chrome, modal";

        loginModal.addOkCallback(this.modalOk);
        loginModal.addCancelCallback(this.modalCancel);

        window.openDialog(RSETB.LOGIN_MODAL, "loginModal", windowFeatures, loginModal);
    };

    /**
     * Function interface for login modal window to communicate username and password
     *
     * @param username
     * @param password
     */
    publisher.modalOk = function(username, password){
        sendUserParams(username, password);
    };

    /**
     * Function interface for login modal window to communicate closure of window
     */
    publisher.modalCancel = function(){
        loginModal.closeModal();
    };

    /**
     * Get last session login status
     */
    publisher.isLoggedIn = function(){
        return isLoggedIn();
    };

    /**
     * Logout user from the system
     */
    publisher.logout = function(){
        var logoutRM = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGOUT, 'GET', true);
        logoutRM.request(
            // Empty request
            null,
            // Success logout function callback
            function(){
                publisher.publish("logout");
                setNotLoggedIn();
                //TODO: Hide voting tools
            },
            // Failed logout function callback
            function(){
                //TODO: Show error window
            }
        );
    };

    /**
     * Login automatically if, in last session, user was logged in
     */
    publisher.autoLogin = function(){
        // If last session user was logged in and firefox login informations was not deleted
        if(isLoggedIn()){
            var username = getLastSavedUsername();
            FBC().log("USERNAME --> " + username);
            var login = retrieveLogin(username);
            var password = login.password;
            FBC().log("PASSWORD --> " + password);
            var requestManager = new RSETB.RequestManager(RSETB.URL_REQUESTS_LOGIN, 'POST', true);

            requestManager.request(
                // Params of request
                {
                    username : username,
                    password: password
                },

                // Successful request callback
                function(doc){
                    loginResponseParser.setDocument(doc, 'login');
                    // Parse XML document
                    try{
                        var outcome = loginResponseParser.getOutcome();
                        var response = loginResponseParser.checkResponse();
                    }catch(error){
                        // TODO: manage this error
                    }

                    if(outcome == "ok"){
                        publisher.publish("login");
                        // TODO: gestire i messaggi e i rating tools
                    }else{
                        // TODO: manage this error
                    }
                },

                // Failed request callback
                function(error){
                    // TODO: manage this error
                }
            );

        }
    };

    return publisher;
};