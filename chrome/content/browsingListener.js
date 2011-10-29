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
RSETB.browsingListener = function(inputRating){

    var redirectedUrl = [];

    var redirectedFromRS = function(url){
        return redirectedUrl.indexOf(url) != -1;
    };

    var removeFromRedirectedPapers = function(url){
        redirectedUrl.splice(redirectedUrl.indexOf(url), 1);
    };

    var isPdf = function(aProgress){
        return aProgress.DOMWindow.document.contentType === "application/pdf";
    };

    var isBlank = function(aURI){
        return aURI.spec === "about:blank";
    };

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
            if (aURI && !isBlank(aURI)){

                var currentURI = aURI.spec;

                FBC().log("current URL id: " + aURI.spec);

                // If paper is in RS get it from it
                if(aRequest && isPdf(aProgress) && !redirectedFromRS(currentURI)){

                    // Cancel current request
                    FBC().log('cancelled');
                    aRequest.cancel(NS_BINDING_ABORTED);

                    // Check if document is in RS
                     var params = {
                        url : currentURI
                    };

                    // Request for Readersourcing paper
                    var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_PDF, "GET", true);
                    requestManager.request(params,
                        // Successful request callback
                        function(response){

                            var responseParser = new RSETB.GetPaperResponseParser();
                            responseParser.setDocument(response, "get-paper-pdf");
                            var outcome = responseParser.getOutcome();
                            var readersourcingFileURL = responseParser.getXMLElementContent("url");

                            // Add URL to redirected URL array
                            redirectedUrl.push(currentURI);

                            // File is in RS, download it
                            if(outcome === "ok"){
                                FBC().log('redirecting to: ' + readersourcingFileURL);
                                gBrowser.loadURI(readersourcingFileURL);
                            }

                            // File in not in RS, restart download download
                            else{
                                redirectedUrl.push(currentURI);
                                FBC().log('redirected to the same url');
                                gBrowser.loadURI(currentURI);
                            }
                        },

                        // Failed request callback
                        function(){
                            // TODO: manage failed request
                        }
                    );
                }
                else if(redirectedFromRS(currentURI)){
                    FBC().log("removed from redirect");
                    removeFromRedirectedPapers(currentURI);
                }
                
                // Get paper vote
                inputRating.requestRating(currentURI);
            }
        },

        // For definitions of the remaining functions see related documentation
        onStateChange : function(aWebProgress, aRequest, aFlag, aStatus){},
        onProgressChange : function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
        onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {},
        onSecurityChange : function(aWebProgress, aRequest, aState) {}
    };
};