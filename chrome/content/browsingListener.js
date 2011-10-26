/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
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

    // Constant to identify abort actions
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


        // This fires when the location bar changes; that is load event is confirmed
        // or when the user switches tabs. If you use listener for more than one tab/window,
        // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
        onLocationChange : function(aProgress, aRequest, aURI){

            // Check current URI is not a blank window
            if (aURI !== null && aURI.spec !== "about:blank"){
                var currentURI = aURI.spec;
                // Check document content type is a pdf
                if(aProgress.DOMWindow.document.contentType === "application/pdf"){
                    // Check if currentURI is a redirection of RS getFile
                    if(currentURI.indexOf(RSETB.URL_GET_PAPER_PDF) < 0){

                        // Suspend current request
                        if(aRequest){
                            //aRequest.suspend();
                            //FBC().log('suspeded');
                        }

                        // Check if document is in RS
                         var params = {
                            url : currentURI
                        };
                        var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_PDF, "GET", true);
                        requestManager.request(params,
                            // Successful request callback
                            function(response){

                                var responseParser = new RSETB.GetPaperResponseParser();
                                responseParser.setDocument(response, "get-paper-pdf");
                                var outcome = responseParser.getOutcome();
                                var fileURL = responseParser.getXMLElementContent("url");

                                // File is in RS, download it
                                if(outcome === "ok"){
                                    //aRequest.cancel(NS_BINDING_ABORTED);
                                    //gBrowser.loadURI(fileURL);

                                    //FBC().log('resuming');
                                    //window.location.replace(fileURL);
                                }

                                // File in not in RS, resume download
                                else{
                                    /*if(aRequest){
                                        aRequest.resume();
                                        FBC().log('resumed');
                                    }*/
                                }
                            },

                            // Failed request callback
                            function(){
                                // TODO: manage failed request
                            }
                        );
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