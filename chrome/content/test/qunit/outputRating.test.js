/**
 * Test module for outputRating
 */

module('outputRating', {

    setup : function(){
        this.xhr = sinon.useFakeXMLHttpRequest();

        var requests = this.requests = [];

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

        this.responseParserStub = {};
        this.responseParserStub.setDocument = function(){};
        this.responseParserStub.getOutcome = function(){
            return 'ok';
        };

        this.responseParserStub.checkResponse = function(){
            return {
                rating : 3.8,
                steadiness : 2,
                description : 'a description'
            };
        };

        this.openDialogStub = sinon.stub(window, "openDialog");


        this.commentModalStub = {
            okCallback : null,
            cancelCallback : null,
            fakeOkClick : function(comment){
                this.okCallback(comment);
            },
            fakeCancelClick : function(){
                this.cancelCallback();
            },
            addOkCallback : function(okCB){
                this.okCallback = okCB;
            },
            addCancelCallback : function(cancelCB){
                this.cancelCallback = cancelCB;
            },
            closeModal : function(){

            },
            setPaperName : function(){
                
            }
        };

        this.cacheStub = sinon.stub(RSETB.cache());

    },

    teardown: function(){
        this.xhr.restore();
        this.openDialogStub.restore();
    }

});


test('Testing output rating process', function(){

    var outputRating = RSETB.outputRating(this.responseParserStub, this.commentModalStub, this.cacheStub);
    outputRating.sendRating("test/page", 2.8);
    this.commentModalStub.fakeOkClick("A test comment :) !");
    equal(this.requests[0].requestBody, "url=test/page&vote=2.8&comment=A%20test%20comment%20:)%20!", "Testing request with message body content");
    outputRating.sendRating("test/page", 2.8);
    this.commentModalStub.fakeCancelClick();
    equal(this.requests[0].requestBody, "url=test/page&vote=2.8", "Testing request without message body content");
});


test('Testing succesful output rating request with message', function(){

    var requestResult = [];

    var verifyRequest = function(request){
        requestResult.push(request.rating);
        requestResult.push(request.steadiness);
        requestResult.push(request.description);
    };

    var outputRating = RSETB.outputRating(this.responseParserStub, this.commentModalStub, this.cacheStub);
    outputRating.subscribe(verifyRequest, 'new-input-rating');

    var params = {
        url : "test/url",
        vote : 3,
        comment : "a comment"
    };
    
    outputRating.sendRating("test/page", 2.8);
    this.commentModalStub.fakeOkClick("A test comment :) !");
    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");


    deepEqual(requestResult, [3.8, 2, 'a description'], "Subscriber content should be 3.8 and 2");
    equal(this.requests[0].method, "POST", "Request method is POST");
});



test('Testing succesful output rating request without message', function(){

    var requestResult = [];

    var verifyRequest = function(request){
        requestResult.push(request.rating);
        requestResult.push(request.steadiness);
        requestResult.push(request.description);
    };

    var outputRating = RSETB.outputRating(this.responseParserStub, this.commentModalStub, this.cacheStub);
    outputRating.subscribe(verifyRequest, 'new-input-rating');

    var params = {
        url : "test/url",
        vote : 3,
        comment : "a comment"
    };

    outputRating.sendRating("test/page", 2.8);
    this.commentModalStub.fakeCancelClick();
    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");

    deepEqual(requestResult, [3.8, 2, 'a description'], "Subscriber content should be 3.8 and 2");
    equal(this.requests[0].method, "POST", "Request method is POST");
});