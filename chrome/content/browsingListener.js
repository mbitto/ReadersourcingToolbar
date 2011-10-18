/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 14/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Implements nsIWebProgressListener interface
 */
RSETB.browsingListener = function(){

    const NS_BINDING_ABORTED = 0x804b0002;

    return{

        init : function(){
            gBrowser.addProgressListener(this);
        },

        QueryInterface : function(aIID){
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
        },

        onLocationChange : function(aProgress, aRequest, aURI){
            // This fires when the location bar changes; that is load event is confirmed
            // or when the user switches tabs. If you use myListener for more than one tab/window,
            // use aProgress.DOMWindow to obtain the tab/window which triggered the change.

            // Check current URI is not a blank window
            if (aURI !== null && aURI.spec !== "about:blank"){
                var currentURI = aURI.spec;
                // Check document content type is a pdf
                // TODO: also check if document is in RS
                if(aProgress.DOMWindow.document.contentType === "application/pdf"){
                    //check if currentURI is a redirection of RS getFile
                    if(currentURI.indexOf(RSETB.URL_GET_MARKED_PDF) < 0){
                        // Abort current request
                        aRequest.cancel(NS_BINDING_ABORTED);
                        // Make a new request to RS server
                        window.content.location.href = RSETB.URL_GET_MARKED_PDF + '?url=' + currentURI;
                    }
                }
            }
        },

        // For definitions of the remaining functions see related documentation
        onStateChange : function(aWebProgress, aRequest, aFlag, aStatus){},
        onProgressChange : function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
        onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {},
        onSecurityChange : function(aWebProgress, aRequest, aState) {}
    };
};