/**
 * Test module for messages
 */

module('messages', {

    setup : function(){
        this.xhr = sinon.useFakeXMLHttpRequest();

        var requests = this.requests = [];

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

        this.clock = sinon.useFakeTimers();
    },

    teardown: function(){
        this.xhr.restore();
        this.clock.restore();
    }
});


test('Testing OK messages request', function(){

    var responseParserStub = {};
    responseParserStub.setDocument = function(){};
    responseParserStub.getOutcome = function(){
        return 'ok';
    };
    responseParserStub.checkResponse = function(){
        return {
            description : 'a description',
            messagesQty : '2',
            messages : [
                {
                    sender : 'sender1',
                    date : 'date1',
                    title : 'title1'
                },
                {
                    sender : 'sender2',
                    date : 'date2',
                    title : 'title2'
                }
            ]
        };
    };


    var requestResult = [];

    var verifyRequest = function(response){
        requestResult.push(response.description);
        requestResult.push(response.messagesQty);
        requestResult.push(response.messages[0].sender);
        requestResult.push(response.messages[0].date);
        requestResult.push(response.messages[1].title);
    };

    var messages = RSETB.messages(responseParserStub);

    messages.subscribe(verifyRequest, 'new-messages');

    messages.init();

    this.clock.tick(3 * 60 * 1000);

    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");

    deepEqual(requestResult, ['a description', '2', 'sender1', 'date1', 'title2'], "Checking subscriber content");
});



test('Testing OK messages request with 0 messages', function(){

    var responseParserStub = {};
    responseParserStub.setDocument = function(){};
    responseParserStub.getOutcome = function(){
        return 'ok';
    };
    responseParserStub.checkResponse = function(){
        return {
            messagesQty : '0'
        };
    };

    var requestResult = null;

    var verifyRequest = function(response){
        requestResult = response.messagesQty;
    };

    var messages = RSETB.messages(responseParserStub);
    messages.init();
    messages.subscribe(verifyRequest, 'no-new-messages');

    this.clock.tick(3 * 60 * 1000);
    this.requests[0].respond(200, "Content-Type: text/xml", "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><test></test>");

    equal(requestResult, 0, "Checking subscriber content");
});