"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('CSS Units Converter is now active!');
    // Register the hover provider for CSS files
    const hoverProvider = vscode.languages.registerHoverProvider('css', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position, /[\d.]+(?:px|rem|vh|vw)/);
            if (!range) {
                return null;
            }
            const word = document.getText(range);
            const conversion = convertCssUnit(word);
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
    const cssValueRegex = /^([\d.]+)(px|rem|vh|vw)$/;
    const match = value.match(cssValueRegex);
    if (!match) {
        return null;
    }
    const numericValue = parseFloat(match[1]);
    const unit = match[2];
    // Get configuration values
    const config = vscode.workspace.getConfiguration('cssUnitsConverter');
    const baseFontSize = config.get('baseFontSize', 16);
    const viewportHeight = config.get('viewportHeight', 900);
    const viewportWidth = config.get('viewportWidth', 1440);
    let convertedValue;
    let convertedUnit;
    let displayText;
    switch (unit) {
        case 'px':
            // Convert px to rem
            convertedValue = numericValue / baseFontSize;
            convertedUnit = 'rem';
            displayText = `**${numericValue}px** = **${convertedValue.toFixed(2)}rem** (base: ${baseFontSize}px)`;
            break;
        case 'rem':
            // Convert rem to px
            convertedValue = numericValue * baseFontSize;
            convertedUnit = 'px';
            displayText = `**${numericValue}rem** = **${convertedValue.toFixed(0)}px** (base: ${baseFontSize}px)`;
            break;
        case 'vh':
            // Convert vh to px
            convertedValue = (numericValue / 100) * viewportHeight;
            convertedUnit = 'px';
            displayText = `**${numericValue}vh** = **${convertedValue.toFixed(0)}px** (viewport height: ${viewportHeight}px)`;
            break;
        case 'vw':
            // Convert vw to px
            convertedValue = (numericValue / 100) * viewportWidth;
            convertedUnit = 'px';
            displayText = `**${numericValue}vw** = **${convertedValue.toFixed(0)}px** (viewport width: ${viewportWidth}px)`;
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
//# sourceMappingURL=extension.js.map