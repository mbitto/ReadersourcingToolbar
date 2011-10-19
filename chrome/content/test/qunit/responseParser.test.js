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

test("Testing login XML document with OK outcome", function(){


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

    equal(response.messageQty, 2, "There are 2 messages");
    equal(response.messages[0].date, "01/01/2011", "Date of first message");
    equal(response.messages[1].title, "title test 2", "Title of second message");
    equal(response.messages[1].sender, "test2@test.com", "Sender of second message");

});


test("Testing login XML document with KO outcome", function(){


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

    equal(response.description, "Something went wrong with authentication", "Error description");
    equal(response.messages[0].errorCode, "101", "First error code");
    equal(response.messages[1].errorMessage, "More strange server error", "Second error code");

});

test("Testing get-paper-vote XML document with OK outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-paper-vote>"
                    + "  <response outcome = 'ok'>"
                    + "    <description>Attributes for paper paper_title</description>"
                    + "    <paper id='paper_id'>"
                    + "      <title>paper_title</title>"
                    + "      <rating>paper_rating</rating>"
                    + "      <steadiness>paper_steadiness</steadiness>"
                    + "    </paper>"
                    + "  </response>"
                    + "</get-paper-vote>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var inputRatingParser = new RSETB.InputRatingResponseParser(parsedXMLDocument);
    var response = inputRatingParser.checkResponse();

    equal(response.id, 'paper_id', "Id of paper");
    equal(response.title, 'paper_title', "The title of paper");
    equal(response.rating, 'paper_rating', "Rating of paper");
    equal(response.steadiness, 'paper_steadiness', "Steadiness of paper");

});


test("Testing get-paper-vote XML document with OK outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-paper-vote>"
                    + "  <response outcome = 'ko'>"
                    + "    <description>Paper Not Indexed within the System</description>"
                    + "  </response>"
                    + "</get-paper-vote>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var inputRatingParser = new RSETB.InputRatingResponseParser(parsedXMLDocument);
    var response = inputRatingParser.checkResponse();

    equal(response.description, 'Paper Not Indexed within the System', "Error description");

});