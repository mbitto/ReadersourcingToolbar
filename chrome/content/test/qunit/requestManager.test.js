/**
 * Test module for RequestManager
 */

module('RequestManager', {

    setup : function(){

        /* Params passed to request manager */
        this.testParams = {
            name : "manuel",
            ninja : true,
            projects : 3
        };

        /* XML Server response */
        this.XMLDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>";
        this.XMLDocument += "<response outcome = 'ok'>";
        this.XMLDocument += "  <messages>";
        this.XMLDocument += "    <message test = 'hello' />";
        this.XMLDocument += "    <message test = 'bye bye' />";
        this.XMLDocument += "  </messages>";
        this.XMLDocument += "</response>";

        var parser = new DOMParser();
        this.parsedXMLDocument = parser.parseFromString(this.XMLDocument, "text/xml");

        /* Fake the XMLHttpRequest */
        this.xhr = sinon.useFakeXMLHttpRequest();

        /* A fake server for synchronous requests */
        this.server = sinon.fakeServer.create();

    },
    teardown: function(){
        this.xhr.restore();
        this.server.restore();
    }

});


test('Testing arguments of xhr open()', function(){

    /* Store every XMLHttpRequest fired in array */
    var requests = [];

    this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
    };

    var requestManager = new RSETB.RequestManager("testing/post/request", "POST", true);
    requestManager.request(this.testParams, function(){}, function(){});

    equal(requests[0].url, "testing/post/request?name=manuel&ninja=true&projects=3", "Testing url argument");
    equal(requests[0].method, "POST", "Testing method argument");

});

test('Testing successful asynchronous POST request', function(){

    /* Store every XMLHttpRequest fired in array */
    var asyncRequests = [];

    this.xhr.onCreate = function (xhr) {
        asyncRequests.push(xhr);
    };


    var callback = sinon.spy();

    /* Testing asynchronous request */
    var requestManager = new RSETB.RequestManager("testing/post/request", "POST", true);
    requestManager.request(this.testParams, callback, callback);

    /* Set request response to OK, and set body of response */
    asyncRequests[0].respond(200, "Content-type: text/xml", this.XMLDocument);

    notEqual(asyncRequests[0].responseXML, null, "XML document returned must not be null");

    ok(callback.calledWith(asyncRequests[0].responseXML), "Callback function arguments should be a DOM representation of test XML document");

    deepEqual(asyncRequests[0].responseXML, this.parsedXMLDocument, "Callback function arguments should be a DOM representation of test XML document");

});

test('Testing failed asynchronous POST request', function(){

    /* Store every XMLHttpRequest fired in array */
    var asyncRequests = [];

    this.xhr.onCreate = function(xhr) {
        asyncRequests.push(xhr);
    };

    var callback = sinon.spy();

    /* Testing asynchronous request */
    var requestManager = new RSETB.RequestManager("testing/post/request", "POST", true);
    requestManager.request(this.testParams, callback, callback);

    /* Set request response to not found*/
    asyncRequests[0].respond(404);
    ok(callback.calledWith("Not Found"), "Callback function arguments should be an error response text");

});

test('Testing successful synchronous POST request', function(){

    this.server.respondWith(
        "POST", /testing\/post\/request/,
        [200, { "Content-type": "text/xml" },
         this.XMLDocument]);

    var doc = this.XMLDocument;

    /* Testing synchronous request */
    var requestManager = new RSETB.RequestManager("testing/post/request", "POST", false);

    var response = requestManager.request(this.testParams);

    notEqual(response, null, "XML document returned must not be null");
    deepEqual(response, this.parsedXMLDocument, "Callback function arguments should be a DOM representation of test XML document");

});

test('Testing failed synchronous POST request', function(){

    /* Response is fired immediately */
    this.xhr.onCreate = function (xhr) {
        xhr.async = false;
        xhr.respond(404);
    };

    var requestManager = new RSETB.RequestManager("testing/post/request", "POST", false);
    var response = requestManager.request(this.testParams);

    ok(response, "Callback function arguments should be an error response text");

});


