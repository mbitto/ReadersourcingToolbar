/**
 * Project: Readersourcing Extension Toolbar
 * Version: 1.1
 *
 * Author: Manuel Bitto (manuel.bitto@gmail.com)
 * Date: 24/09/11
 */

// Define ReaderSourcing Extension ToolBar (RSETB) namespace
var RSETB = RSETB || {};

/**
 * Toolbar object, it can include menu and widgets and offer some method for general purposes
 */
RSETB.toolbar = function(){

    var tools = [];

    return {
        /**
         * Initialize toolbar
         */
        init: function(){
            //todo:something to initialize here?
            FBC().log('Toolbar initialized');
        },

        /**
         * Add a tool to the toolbar
         *
         * @param tool
         * @param callback
         */
        addTool : function(tool, callback){
            var name = tool.getName();
            //check if name already exists
            if (name in tools){
                throw new Error('name of entry: ' +  name + ' already exists');
            }
            if(typeof callback !== "undefined"){
                FBC().log(tool.getName());
                tool.registerCallback(callback);
            }
            tools[name] = tool;
        },

        /**
         * Return a tool given the name
         *
         * @param toolName name of tool
         */
        getTool : function(toolName){
            return tools[toolName];
        }
    };

};