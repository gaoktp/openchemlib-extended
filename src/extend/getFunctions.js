'use strict';

var functionIndex = require('./functions');

module.exports = function getFunctions() {
    var currentFunctionCodes = this.getFunctionCodes();
    var currentFunctions = [];
    for (var fragment of currentFunctionCodes) {
        if (functionIndex[fragment.idCode]) {
            var currentFunction = JSON.parse(JSON.stringify(functionIndex[fragment.idCode]));
            currentFunction.atomMap = fragment.atomMap;
            currentFunctions.push(currentFunction);
        }
    }
    return currentFunctions;
};
