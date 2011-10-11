/**
 * Extract elements form responseXML.documentElement to
 * associative array. preferred Param can be array of
 * particular nodes that you want to get without knowing
 * array or dom hieracy
 *
 * @param _destinationURL
 * @param _requestType
 *
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

//TODO : refactor this object, create a base object and inherit 2 different object, 1 for async (callback) and 1 for sync (return)
RSETB.RequestManager = function(destinationURL, requestType, async){

    var abortTime = 5;
    var successCallback = null;
    var failCallback = null;
    var httpRequest = new XMLHttpRequest();

    // Send string and wait for the response of server
    var connect = function(outputMessage){
        var url = destinationURL + "?" + outputMessage;

        if(async){
            return asyncConnection(url);
        }
        else{
            return syncConnection(url);
        }
    };

    var asyncConnection = function(url){
        httpRequest.open(requestType, url, async);
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                    var domElement = httpRequest.responseXML;
                    successCallback(domElement);
                }
                else {
                    failCallback(httpRequest.statusText);
                }
            }
        };
        //abortAfter(abortTime);
        httpRequest.send();
        return true;
    };

    var syncConnection = function(url){
        httpRequest.open(requestType, url, async);
        //abortAfter(abortTime);
        httpRequest.send();
        if(httpRequest.status == 200) {
            return httpRequest.responseXML;
        }
        else {
            return httpRequest.statusText;
        }
    };

    var abortAfter = function(seconds){
        setTimeout(function(){
            if(httpRequest != null){
                httpRequest.abort();
                failCallback(httpRequest.statusText);
            }
        }, seconds * 1000);
    };

    this.request = function(params, success, fail){

        successCallback = success || null;
        failCallback = fail || null;

        var httpFormattedString = "";
        var param, value;
        for (param in params) {
            value = params[param];
            httpFormattedString += param + "=" + value + "&";
        }
        httpFormattedString = httpFormattedString.slice(0, httpFormattedString.length - 1);
        httpFormattedString = encodeURI(httpFormattedString);
        return connect(httpFormattedString);
    };
};