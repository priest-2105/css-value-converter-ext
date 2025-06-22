"use strict";
exports.__esModule = true;
exports.deactivate = exports.activate = void 0;
var vscode = require("vscode");
function activate(context) {
    console.log('CSS Units Converter is now active!');
    // Register the hover provider for CSS files
    var hoverProvider = vscode.languages.registerHoverProvider('css', {
        provideHover: function (document, position, token) {
            var range = document.getWordRangeAtPosition(position, /[\d.]+(?:px|rem|vh|vw)/);
            if (!range) {
                return null;
            }
            var word = document.getText(range);
            var conversion = convertCssUnit(word);
            if (!conversion) {
                return null;
            }
            return new vscode.Hover(conversion.displayText);
        }
    });
    context.subscriptions.push(hoverProvider);
}
exports.activate = activate;
function convertCssUnit(value) {
    // Regex to match CSS values with units
    var cssValueRegex = /^([\d.]+)(px|rem|vh|vw)$/;
    var match = value.match(cssValueRegex);
    if (!match) {
        return null;
    }
    var numericValue = parseFloat(match[1]);
    var unit = match[2];
    // Get configuration values
    var config = vscode.workspace.getConfiguration('cssUnitsConverter');
    var baseFontSize = config.get('baseFontSize', 16);
    var viewportHeight = config.get('viewportHeight', 900);
    var viewportWidth = config.get('viewportWidth', 1440);
    var convertedValue;
    var convertedUnit;
    var displayText;
    switch (unit) {
        case 'px':
            // Convert px to rem
            convertedValue = numericValue / baseFontSize;
            convertedUnit = 'rem';
            displayText = "**".concat(numericValue, "px** = **").concat(convertedValue.toFixed(2), "rem** (base: ").concat(baseFontSize, "px)");
            break;
        case 'rem':
            // Convert rem to px
            convertedValue = numericValue * baseFontSize;
            convertedUnit = 'px';
            displayText = "**".concat(numericValue, "rem** = **").concat(convertedValue.toFixed(0), "px** (base: ").concat(baseFontSize, "px)");
            break;
        case 'vh':
            // Convert vh to px
            convertedValue = (numericValue / 100) * viewportHeight;
            convertedUnit = 'px';
            displayText = "**".concat(numericValue, "vh** = **").concat(convertedValue.toFixed(0), "px** (viewport height: ").concat(viewportHeight, "px)");
            break;
        case 'vw':
            // Convert vw to px
            convertedValue = (numericValue / 100) * viewportWidth;
            convertedUnit = 'px';
            displayText = "**".concat(numericValue, "vw** = **").concat(convertedValue.toFixed(0), "px** (viewport width: ").concat(viewportWidth, "px)");
            break;
        default:
            return null;
    }
    return {
        value: convertedValue,
        unit: convertedUnit,
        displayText: displayText
    };
}
function deactivate() { }
exports.deactivate = deactivate;
