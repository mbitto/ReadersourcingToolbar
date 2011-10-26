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
    },

    teardown: function(){
        this.xhr.restore();
    }

});


test('Testing succesful output rating request', function(){

    var requestResult = [];

    var verifyRequest = function(aVar){
        requestResult.push(aVar);
    };

    var outputRating = RSETB.outputRating(this.responseParserStub);

    outputRating.subscribe(verifyRequest, 'rating');
    outputRating.subscribe(verifyRequest, 'steadiness');

    var params = {
        url : "test/url",
        vote : 3
    };
    
    outputRating.setRating(params);

    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");

    deepEqual(requestResult, [3.8, 2], "Subscriber content should be 3.8 and 2");
    equal(this.requests[0].method, "POST", "Request method is POST");
});