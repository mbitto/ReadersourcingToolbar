/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 12/10/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};


/**
 * @constructor Base object to parse the XML response
 *
 * @param document
 * @param expectedRootName
 */
RSETB.ResponseParser = function(document, expectedRootName){
    
    var responseTagName = "response";
    var outcomeAttributeName = "outcome";
    var outcomeOk = "ok";
    var outcomeKo = "ko";

    this.getXMLRoot = function(rootName){
        var root = document.documentElement;
        if(typeof root === "undefined"){
            throw new Error("Malformed XML: " + rootName + " root not found in XML response");
        }
        return root;
    };

    this.getXMLElement = function(elementName, parentElement){
        parentElement = parentElement || document;
        var element = parentElement.getElementsByTagName(elementName)[0];
        if(typeof element === "undefined"){
            throw new Error("Malformed XML: " + elementName + " element  not found in XML response");
        }
        return element;
    };

    this.getXMLElements = function(elementName, parentElement){
        parentElement = parentElement || document;
        var elements = parentElement.getElementsByTagName(elementName);
        if(elements.length == 0){
            throw new Error("Malformed XML: " + elementName + "element not found in XML response");
        }
        return elements;
    };

    this.getXMLAttribute = function(attributeName, relatedComponent){
        var attribute = relatedComponent.getAttribute(attributeName);
        if(attribute === null){
            throw new Error("Malformed XML: " + attributeName + " attribute not found in XML response");
        }
        return attribute;
    };

    this.getXMLElementContent = function(elementName, parentElement){
        var element = this.getXMLElement(elementName, parentElement);
        return element.textContent;
    };

    this.getOutcome = function(){
        var root = this.getXMLRoot(expectedRootName);
        var response = this.getXMLElement(responseTagName, root);
        var outcome = this.getXMLAttribute(outcomeAttributeName, response);
        if(outcome !== outcomeOk && outcome !== outcomeKo){
            throw new Error("Malformed XML: outcome is" + outcome + " but " + outcomeOk + " or " + outcomeKo + " are expected");
        }
        return outcome;
    };
};

/**
 * Parse login XML response
 *
 * @param document
 */
RSETB.LoginResponseParser = function(document){

    // Inherits from ResponseParser
    this.base = RSETB.ResponseParser;
    this.base(document, 'login');

    this.checkResponse = function(){
        var outcome = this.getOutcome();
        if(outcome === "ok"){
            var messagesRoot = this.getXMLElement("messages");
            var messagesQty = this.getXMLAttribute("count", messagesRoot);
            var messagesQueue = [];
            var messages = this.getXMLElements("message");
            for(var i=0; i<messagesQty; i++){
                messagesQueue.push(
                    {
                        id : this.getXMLAttribute("id", messages[i]),
                        sender : this.getXMLElementContent("sender", messages[i]),
                        date : this.getXMLElementContent("date", messages[i]),
                        title : this.getXMLElementContent("title", messages[i])
                    }
                );
            }
            return {
                messageQty : messagesQty,
                messages : messagesQueue
            };
        }
        else {

            var description = this.getXMLElementContent("description");
            var errorsRoot = this.getXMLElement("errors");
            var errors = this.getXMLElements("error", errorsRoot);
            var errorsQueue = [];
            for(var j=0; j<errors.length; j++){
                errorsQueue.push(
                    {
                        errorCode: this.getXMLAttribute("code", errors[j]),
                        errorMessage: errors[j].textContent
                    }
                );
            }
            return {
                description : description,
                messages : errorsQueue
            };
        }
    };
};

// Ensure descendant prototype update
RSETB.LoginResponseParser.prototype = RSETB.ResponseParser;


/**
 * Parse get-paper-vote XML response
 *
 * @param document
 */
RSETB.InputRatingResponseParser = function(document){

    // Inherits from ResponseParser
    this.base = RSETB.ResponseParser;
    this.base(document, 'get-paper-vote');

    this.checkResponse = function(){
        var outcome = this.getOutcome();
        if(outcome === "ok"){

            var paper = this.getXMLElement("paper");
            var paperId = this.getXMLAttribute("id", paper);

            var title = this.getXMLElementContent("title", paper);
            var rating = this.getXMLElementContent("rating", paper);
            var steadiness = this.getXMLElementContent("steadiness", paper);

            return{
                id: paperId,
                title: title,
                rating: rating,
                steadiness: steadiness
            };
        }
        else {
            return {
                description : this.getXMLElementContent("description")
            }
        }
    };
};

// Ensure descendant prototype update
RSETB.InputRatingResponseParser.prototype = RSETB.ResponseParser;
