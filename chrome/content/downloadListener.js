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

    // Status of download when has just been added to download queue
    const DOWNLOAD_QUEUED = Components.interfaces.nsIDownloadManager.DOWNLOAD_QUEUED;

    // Array of url that have been already verified on RS server
    var verifiedUrlSet = [];

    /**
     * Check if downloading file is a pdf
     *
     * @param mimeInfo
     */
    var isPdf = function(mimeInfo){
        return (mimeInfo.MIMEType === "application/pdf");
    };

     /**
     * Check if url is from RS get-file or url has already been verified by RS server
     *
     * @param url
     */
    var verifiedUrl = function(url){
        FBC().log(url);
        FBC().log(RSETB.URL_GET_FILE_PDF);
        return (url.indexOf(RSETB.URL_GET_FILE_PDF) !== -1 || verifiedUrlSet.indexOf(url) !== -1);
    };

    /**
     * Check if url has already been verified by RS server
     *
     * @param state
     */
    var isInQueuedState = function(state){
        return state === DOWNLOAD_QUEUED;
    };

    /**
     * Add a download to download manager
     *
     * @param from
     * @param to
     * @param title
     * @param mimeInfo
     */
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
        /**
         * Initialize download listener
         */
        init: function(){
            downloadManager.addListener(this);
        },

        /**
         * Uninitialize download listener
         */
        uninit: function(){
            downloadManager.removeListener(this);
        },

        onDownloadStateChange: function(aState, aDownload){},
        onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus, aDownload){

            var currentUrl = aDownload.source.spec;
            var downloadId = aDownload.id;
            var targetURI = aDownload.target;
            var displayName = aDownload.displayName;
            var mimeInfo= aDownload.MIMEInfo;


            if(isInQueuedState(aDownload.state) && isPdf(mimeInfo) && !verifiedUrl(currentUrl)){
                try{
                    downloadManager.cancelDownload(downloadId);
                    downloadManager.removeDownload(downloadId);
                    FBC().log("Download from " + currentUrl + " cancelled");
                }
                catch(e){
                    // TODO: manage this error
                    FBC().log(e);
                }

                // Do some checks -> url in RS
                var params = {
                    url : currentUrl
                };

                var requestManager = new RSETB.RequestManager(RSETB.URL_GET_PAPER_PDF, "GET", true);
                requestManager.request(params,
                    // Succesful request callback
                    function(response){

                        FBC().log(response);

                        var responseParser = new RSETB.ResponseParser();
                        responseParser.setDocument(response, "get-paper-pdf");
                        var outcome = responseParser.getOutcome();
                        var rsFileUrl = responseParser.getXMLElementContent("url");

                        verifiedUrlSet.push(currentUrl);

                        if(outcome === "ok"){
                            // Start a download from RS
                            FBC().log("start download from " + rsFileUrl);
                            addDownload(rsFileUrl, targetURI, displayName, mimeInfo);
                        }
                        else{
                            // (Re)start previous download
                            FBC().log("start download from " + currentUrl);
                            addDownload(currentUrl, targetURI, displayName, mimeInfo);
                        }
                    },

                    // Failed request callback
                    function(){
                        // TODO: manage failed request
                    }
                );

            }
        },
        onProgressChange: function(a, b, c, d, e, f, g){},
        onSecurityChange: function(a, b, c, d){}
    };
};