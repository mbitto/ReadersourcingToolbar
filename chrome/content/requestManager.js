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
 * @constructor a manager for every request that is generated from the toolbar to RS server
 *
 * @param destinationURL
 * @param requestType
 * @param async
 */
RSETB.RequestManager = function(destinationURL, requestType, async){

    var abortTime = 5;
    var successCallback = null;
    var failCallback = null;
    var httpRequest = new XMLHttpRequest();

    // Format url
    var prepareUrl = function(outputMessage){
        var url = destinationURL;
        if(requestType === "GET"){
            outputMessage = (outputMessage == "") ? "" : "?" + outputMessage;
            url += outputMessage;
        }
        return url;
    };

    var asyncConnection = function(url, outputMessage){
        httpRequest.open(requestType, url, async);
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                    var domElement = httpRequest.responseXML;
                    if(domElement === null){
                        throw new Error("XML received could be malformed");
                    }
                    successCallback(domElement);
                }
                else {
                    failCallback(httpRequest.statusText);
                }
            }
        };
        var body = null;
        if(requestType === "POST"){
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            body = outputMessage;
        }
        httpRequest.send(body);
        //abortAfter(abortTime);
        return true;
    };

    var syncConnection = function(url, outputMessage){
        httpRequest.open(requestType, url, async);
        //abortAfter(abortTime);
        var body = null;
        if(requestType === "POST"){
            body = outputMessage
        }
        httpRequest.send(body);

        if(httpRequest.status == 200) {
            return httpRequest.responseXML;
        }
        else {
            return httpRequest.statusText;
        }
    };

    // TODO: test this method
    var abortAfter = function(seconds){
        setTimeout(function(){
            if(httpRequest != null){
                httpRequest.abort();
                failCallback(httpRequest.statusText);
            }
        }, seconds * 1000);
    };

    /**
     * Make a request to server
     *
     * @param params of the request
     * @param success callback called when server sends a successful response
     * @param fail callback called when server doesn't respond or sends an error response
     */
    this.request = function(params, success, fail){

        var httpFormattedString = "";
        successCallback = success || null;
        failCallback = fail || null;

        // Convert params to a http formatted string
        if(params !== null){
            var param, value;
            for (param in params) {
                value = params[param];
                httpFormattedString += param + "=" + value + "&";
            }
            httpFormattedString = httpFormattedString.slice(0, httpFormattedString.length - 1);
            httpFormattedString = encodeURI(httpFormattedString);
        }

        var url = prepareUrl(httpFormattedString);

        if(async){
            asyncConnection(url, httpFormattedString);
        }
        else{
            return syncConnection(url, httpFormattedString);
        }
    };
};