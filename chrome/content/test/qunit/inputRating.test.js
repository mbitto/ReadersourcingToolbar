/**
 * Test module for inputRating
 */

module('inputRating', {

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


test('Testing succesful input rating request', function(){

    var requestResult = [];

    var verifyRequest = function(aVar){
        requestResult.push(aVar);
    };

    var inputRating = RSETB.inputRating(this.responseParserStub);

    inputRating.subscribe(verifyRequest, 'rating');
    inputRating.subscribe(verifyRequest, 'steadiness');
    inputRating.requestRating('test/url');

    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");

    deepEqual(requestResult, [3.8, 2], "Subscriber content should be 3.8 and 2");
});