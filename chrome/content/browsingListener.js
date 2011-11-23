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

    // Create a publisher to mix its methods with browsingListener
    var publisher = new MBJSL.Publisher();

    // Constant to identify abort actions
    const NS_BINDING_ABORTED = 0x804b0002;

    publisher.init = function(){
        gBrowser.addProgressListener(this);
    };

    publisher.QueryInterface = function(aIID){
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    };

    // This fires when the location bar changes; that is load event is confirmed
    // or when the user switches tabs. If you use listener for more than one tab/window,
    // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
    publisher.onLocationChange = function(aProgress, aRequest, aURI){

        // Check current URI is not a blank window
        if (aURI){
            var currentURI = aURI.spec;

            // If paper is in RS get it from RS
            if(aRequest && isPdf(aProgress) && !redirectedFromRS(currentURI)){
                // Cancel current request
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
                            gBrowser.loadURI(readersourcingFileURL);
                        }
                        // File in not in RS, restart download
                        else{
                            gBrowser.loadURI(currentURI);
                        }
                    },

                    // Failed request callback
                    function(error){
                         RSETB.notificationBox(error, RSETB.HOME_PAGE);
                    }
                );                    
            }
            else if(redirectedFromRS(currentURI)){
                removeFromRedirectedPapers(currentURI);
                publisher.publish("new-page", currentURI);
            }
            else{
                publisher.publish("new-page", currentURI);
            }
        }
    };

    // For definitions of the remaining functions see related documentation
    publisher.onStateChange = function(aWebProgress, aRequest, aFlag, aStatus){};
    publisher.onProgressChange = function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {};
    publisher.onStatusChange = function(aWebProgress, aRequest, aStatus, aMessage) {};
    publisher.onSecurityChange = function(aWebProgress, aRequest, aState) {};

    return publisher;
};