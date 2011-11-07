/**
 * Project: ...
 * Version: ...
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 12/10/11
 */

module('ResponseParser', {

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

    var loginParser = new RSETB.LoginResponseParser();
    loginParser.setDocument(parsedXMLDocument, 'login');

    var response = loginParser.checkResponse();

    equal(response.messagesQty, 2, "There are 2 messages");
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

    var loginParser = new RSETB.LoginResponseParser();
    loginParser.setDocument(parsedXMLDocument, 'login');
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
                    + "      <comments>10</comments>"
                    + "    </paper>"
                    + "  </response>"
                    + "</get-paper-vote>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var inputRatingParser = new RSETB.GetRatingResponseParser();
    inputRatingParser.setDocument(parsedXMLDocument, 'get-paper-vote');
    var response = inputRatingParser.checkResponse();

    equal(response.id, 'paper_id', "Id of paper");
    equal(response.title, 'paper_title', "The title of paper");
    equal(response.rating, 'paper_rating', "Rating of paper");
    equal(response.steadiness, 'paper_steadiness', "Steadiness of paper");
    equal(response.commentsQty, '10', "Comments quantity of paper");

});


test("Testing get-paper-vote XML document with KO outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-paper-vote>"
                    + "  <response outcome = 'ko'>"
                    + "    <description>Paper Not Indexed within the System</description>"
                    + "  </response>"
                    + "</get-paper-vote>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var inputRatingParser = new RSETB.GetRatingResponseParser();
    inputRatingParser.setDocument(parsedXMLDocument, 'get-paper-vote');
    var response = inputRatingParser.checkResponse();

    equal(response.description, 'Paper Not Indexed within the System', "Error description");

});


test("Testing get-paper-pdf XML document with OK outcome", function(){

    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-paper-pdf>"
                    + "  <response outcome = 'ok'>"
                    + "    <description>File can be downloaded from: marked_pdf_url</description>"
                    + "    <url>marked_pdf_url</url>"
                    + "  </response>"
                    + "</get-paper-pdf>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var getPaperParser = new RSETB.GetPaperResponseParser();
    getPaperParser.setDocument(parsedXMLDocument, 'get-paper-pdf');
    var response = getPaperParser.checkResponse();

    equal(response.url, "marked_pdf_url", "url for download file");
    equal(response.description, "File can be downloaded from: marked_pdf_url", "Associate description");
});


test("Testing get-paper-pdf XML document with KO outcome", function(){


    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-paper-pdf>"
                    + "  <response outcome = 'ko'>"
                    + "    <description>A problem occurred, Falling back to original: original_url</description>"
                    + "    <url>original_url</url>"
                    + "    <errors>"
                    + "      <error code='101'>Strange server error</error>"
                    + "      <error code='102'>More strange server error</error>"
                    + "    </errors>"
                    + "  </response>"
                    + "</get-paper-pdf>";


    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var getPaperParser = new RSETB.GetPaperResponseParser();
    getPaperParser.setDocument(parsedXMLDocument, 'get-paper-pdf');
    var response = getPaperParser.checkResponse();

    equal(response.description, "A problem occurred, Falling back to original: original_url", "Error description");
    equal(response.url, "original_url", "url for download original file");
    equal(response.messages[0].errorCode, "101", "First error code");
    equal(response.messages[1].errorMessage, "More strange server error", "Second error code");
});


test("Testing get-msg XML document with OK outcome", function(){

    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-msg>"
                    + "  <response outcome = 'ok'>"
                    + "    <description>Fetching New Messages for user Manuel</description>"
                    + "      <messages count='2'>"
                    + "         <message id='message_id'>"
                    + "            <sender>sender1_email</sender>"
                    + "            <date>message1_date</date>"
                    + "            <title>message1_title</title>"
                    + "         </message>"
                    + "         <message id='message_id'>"
                    + "            <sender>sender2_email</sender>"
                    + "            <date>message2_date</date>"
                    + "            <title>message2_title</title>"
                    + "         </message>"
                    + "     </messages>"
                    + "  </response>"
                    + "</get-msg>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var getMessagesParser = new RSETB.GetMessagesResponseParser();
    getMessagesParser.setDocument(parsedXMLDocument, 'get-msg');
    var response = getMessagesParser.checkResponse();

    equal(response.description, "Fetching New Messages for user Manuel", "A Description");
    equal(response.messagesQty, "2", "Messages quantity");
    equal(response.messages[0].sender, "sender1_email", "Sender email");
    equal(response.messages[1].date, "message2_date", "Sender date");
    equal(response.messages[1].title, "message2_title", "Sender title");
});


test("Testing get-msg XML document with KO outcome", function(){

    /* XML Server response */
    var xmlDocument = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>"
                    + "<get-msg>"
                    + "  <response outcome = 'ko'>"
                    + "    <description>You Are Not Logged in. Have you disabled support for session cookies?</description>"
                    + "  </response>"
                    + "</get-msg>";

    var parser = new DOMParser();
    var parsedXMLDocument = parser.parseFromString(xmlDocument, "text/xml");

    var getMessagesParser = new RSETB.GetMessagesResponseParser();
    getMessagesParser.setDocument(parsedXMLDocument, 'get-msg');
    var response = getMessagesParser.checkResponse();

    equal(response, "You Are Not Logged in. Have you disabled support for session cookies?", "An error Description");
});

