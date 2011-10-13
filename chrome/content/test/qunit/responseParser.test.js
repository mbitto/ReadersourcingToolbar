/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 12/10/11
 */

module('responseParser', {

    setup : function(){

    },
    teardown: function(){
        
    }
});

test("Testing login XML document with ok outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<login>"
                    + "  <response outcome = 'ok'>"
                    + "    <messages count='2'>"
                    + "      <message id='m1'>"
                    + "        <sender>test1@test.com</sender>"
                    + "        <date>01/01/2011</date>"
                    + "        <title>title test 1</title>"
                    + "      </message>"
                    + "      <message id='m1'>"
                    + "        <sender>test2@test.com</sender>"
                    + "        <date>01/01/2011</date>"
                    + "        <title>title test 2</title>"
                    + "      </message>"
                    + "    </messages>"
                    + "  </response>"
                    + "</login>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var loginParser = new RSETB.LoginResponseParser(parsedXMLDocument);
    var response = loginParser.checkResponse();

    console.log(response);

    equal(response.messageQty, 2, "There are 2 messages");
    equal(response.messages[0].date, "01/01/2011", "Date of first message");
    equal(response.messages[1].title, "title test 2", "Title of second message");
    equal(response.messages[1].sender, "test2@test.com", "Sender of second message");

});


test("Testing login XML document with ok outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<login>"
                    + "  <response outcome = 'ko'>"
                    + "    <description>Something went wrong with authentication</description>"
                    + "    <errors>"
                    + "      <error code='101'>Strange server error</error>"
                    + "      <error code='102'>More strange server error</error>"
                    + "    </errors>"
                    + "  </response>"
                    + "</login>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var loginParser = new RSETB.LoginResponseParser(parsedXMLDocument);
    var response = loginParser.checkResponse();

    console.log(response);

    equal(response.description, "Something went wrong with authentication", "Error description");
    equal(response.messages[0].errorCode, "101", "First error code");
    equal(response.messages[1].errorMessage, "More strange server error", "Second error code");

});