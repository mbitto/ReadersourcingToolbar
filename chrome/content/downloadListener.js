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
 * Implements nsIDownloadProgressListener Interface
 */
RSETB.downloadListener = function(){

    // Get firefox download manager service
    var downloadManager = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);
    const DOWNLOADING = Components.interfaces.nsIDownloadManager.DOWNLOAD_DOWNLOADING;
    const PAUSED = Components.interfaces.nsIDownloadManager.DOWNLOAD_PAUSED;
    const CANCELED = Components.interfaces.nsIDownloadManager.DOWNLOAD_CANCELED;
    const FINISHED = Components.interfaces.nsIDownloadManager.DOWNLOAD_FINISHED;
    const BLOCKED = Components.interfaces.nsIDownloadManager.DOWNLOAD_BLOCKED_PARENTAL;

    var downloadOriginalQueue = [];
    var downloadFromRS = [];

    var downloadOriginal = function(id){
        return (downloadOriginalQueue.indexOf(id) >= 0);
    };

    var isPdf = function(mimeInfo){
        return (mimeInfo.MIMEType === "application/pdf");
    };

    var isUrlFromRS = function(url){
        return url.indexOf(RSETB.URL_REQUESTS) < 0;
    };

    var addDownload = function (from, to, title, mimeInfo){

        var ioService  = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
        var uri = ioService.newURI(from, null , null);
        var url = uri.QueryInterface(Components.interfaces.nsIURL);

        var nsIWBP = Components.interfaces.nsIWebBrowserPersist;
        var persist = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
        persist.persistFlags = nsIWBP.PERSIST_FLAGS_NO_CONVERSION |
               nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES |
               nsIWBP.PERSIST_FLAGS_BYPASS_CACHE;

        persist.progressListener = downloadManager.addDownload ( 0 , uri , to , title || from, mimeInfo , null , null , null, persist );
        persist.saveURI(url, null, null, null, "", to);

    };



    return {

        init: function(){
            downloadManager.addListener(this);
        },

        uninit: function(){
            downloadManager.removeListener(this);
        },

        QueryInterface: function(aIID){
            if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
                return this;
            throw Components.results.NS_NOINTERFACE;
        },

        onDownloadStateChange: function(aState, aDownload){

            switch(aDownload.state) {
                case DOWNLOADING:
                    FBC().log("downloading");

                    if(!downloadOriginal(aDownload.id)){
                        downloadManager.pauseDownload(aDownload.id);
                    }

                    break;
                case PAUSED:
                    FBC().log("paused");

                    if(isPdf(aDownload.MIMEInfo) && isUrlFromRS(aDownload.source.spec)){

                        // Do some checks -> url in RS

                        var params = {
                            url : aDownload.source.spec
                        };

                        var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_PDF, "GET", true);
                        requestManager.request(params,
                            // Succesful request callback
                            function(response){

                                FBC().log(response);

                                var responseParser = new RSETB.ResponseParser(response, "get-paper-pdf");
                                var outcome = responseParser.getOutcome();
                                var fileURL = responseParser.getXMLElementContent("url");

                                if(outcome === "ok"){
                                    downloadFromRS[id] = fileURL;
                                    downloadManager.cancelDownload(aDownload.id);
                                }
                                else{
                                    downloadOriginalQueue.push(aDownload.id);
                                    downloadManager.resumeDownload(aDownload.id);
                                }
                            },

                            // Failed request callback
                            function(){
                                // TODO: manage failed request
                            }
                        );
                    }
                    else{
                        downloadOriginalQueue.push(aDownload.id);
                        downloadManager.resumeDownload(aDownload.id);
                    }

                    break;
                case CANCELED:

                    var oldDownloadURI = aDownload.source.spec;
                    var targetURI = aDownload.target;
                    var displayName = aDownload.displayName;
                    var mimeInfo= aDownload.MIMEInfo;
                    var newDownloadURI = downloadFromRS[aDownload.id];
                    
                    FBC().log("cancelled");
                    FBC().log("start: " + newDownloadURI);

                    downloadManager.removeDownload(aDownload.id);
                    //aDownload.cancelable.cancel(0x804b0002);
                    downloadManager.cleanUp();

                    addDownload(newDownloadURI, targetURI, displayName, mimeInfo);

                    break;
                case FINISHED:

                    FBC().log("finished");

                    break;

                case BLOCKED:

                    FBC().log("blocked");

                    break;
            }
        },

        onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus, aDownload){},
        onProgressChange: function(a, b, c, d, e, f, g){},
        onSecurityChange: function(a, b, c, d){}
    };
};
