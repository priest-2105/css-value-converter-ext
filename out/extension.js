"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('CSS Units Converter is now active!');
    // Register the hover provider for CSS files
    const hoverProvider = vscode.languages.registerHoverProvider('css', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position, /[\d.]+(?:px|rem|em|vh|vw|%|pt|cm|mm|in)/);
            if (!range) {
                return null;
            }
            const word = document.getText(range);
            const conversion = convertCssUnit(word);
            if (!conversion) {
                return null;
            }
            const markdown = createHoverMarkdown(conversion);
            return new vscode.Hover(markdown);
        }
    });
    context.subscriptions.push(hoverProvider);
}
exports.activate = activate;
function createHoverMarkdown(conversion) {
    const markdown = new vscode.MarkdownString();
    // Get configuration values for context
    const config = vscode.workspace.getConfiguration('cssUnitsConverter');
    const baseFontSize = config.get('baseFontSize', 16);
    const viewportHeight = config.get('viewportHeight', 900);
    const viewportWidth = config.get('viewportWidth', 1440);
    // Header with icon and color
    markdown.appendMarkdown(`## 🎨 CSS Unit Converter\n\n`);
    // Original value with styling
    markdown.appendMarkdown(`**Original:** \`${conversion.originalValue}${conversion.originalUnit}\`\n\n`);
    // Multiple conversions
    markdown.appendMarkdown(`**Conversions:**\n`);
    conversion.conversions.forEach((conv, index) => {
        const icon = getUnitIcon(conv.unit);
        const color = getUnitColor(conv.unit);
        markdown.appendMarkdown(`${icon} \`${conv.value.toFixed(getDecimalPlaces(conv.unit))}${conv.unit}\` ${conv.label}\n`);
    });
    markdown.appendMarkdown(`\n`);
    // Context information based on unit type
    const contextInfo = getContextInfo(conversion.originalUnit, baseFontSize, viewportHeight, viewportWidth);
    if (contextInfo) {
        markdown.appendMarkdown(contextInfo);
    }
    // Footer with settings info
    markdown.appendMarkdown(`\n---\n`);
    markdown.appendMarkdown(`⚙️ *Configure in VS Code settings*\n`);
    return markdown;
}
function getUnitIcon(unit) {
    const icons = {
        'px': '📏',
        'rem': '📐',
        'em': '📏',
        'vh': '📱',
        'vw': '📱',
        '%': '📊',
        'pt': '📄',
        'cm': '📏',
        'mm': '📏',
        'in': '📏'
    };
    return icons[unit] || '📏';
}
function getUnitColor(unit) {
    const colors = {
        'px': '#007acc',
        'rem': '#4CAF50',
        'em': '#FF9800',
        'vh': '#9C27B0',
        'vw': '#9C27B0',
        '%': '#F44336',
        'pt': '#607D8B',
        'cm': '#795548',
        'mm': '#795548',
        'in': '#795548'
    };
    return colors[unit] || '#666';
}
function getDecimalPlaces(unit) {
    const decimalPlaces = {
        'px': 0,
        'pt': 0,
        'cm': 2,
        'mm': 1,
        'in': 3,
        'rem': 2,
        'em': 2,
        'vh': 0,
        'vw': 0,
        '%': 1
    };
    return decimalPlaces[unit] || 0;
}
function getContextInfo(unit, baseFontSize, viewportHeight, viewportWidth) {
    switch (unit) {
        case 'px':
        case 'rem':
        case 'em':
            return `📏 **Base font size:** ${baseFontSize}px\n💡 *1rem = ${baseFontSize}px, 1em = ${baseFontSize}px*\n`;
        case 'vh':
            return `📱 **Viewport height:** ${viewportHeight}px\n💡 *1vh = ${(viewportHeight / 100).toFixed(0)}px*\n`;
        case 'vw':
            return `📱 **Viewport width:** ${viewportWidth}px\n💡 *1vw = ${(viewportWidth / 100).toFixed(0)}px*\n`;
        case '%':
            return `📊 **Percentage:** Relative to parent element\n💡 *Context dependent*\n`;
        case 'pt':
            return `📄 **Points:** 1pt = 1.333px\n💡 *Print-friendly unit*\n`;
        case 'cm':
            return `📏 **Centimeters:** 1cm = 37.795px\n💡 *Physical measurement*\n`;
        case 'mm':
            return `📏 **Millimeters:** 1mm = 3.7795px\n💡 *Physical measurement*\n`;
        case 'in':
            return `📏 **Inches:** 1in = 96px\n💡 *Physical measurement*\n`;
        default:
            return '';
    }
}
function convertCssUnit(value) {
    // Regex to match CSS values with units
    const cssValueRegex = /^([\d.]+)(px|rem|em|vh|vw|%|pt|cm|mm|in)$/;
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
    const conversions = [];
    switch (unit) {
        case 'px':
            conversions.push({ value: numericValue / baseFontSize, unit: 'rem', label: '(rem)' }, { value: numericValue / baseFontSize, unit: 'em', label: '(em)' }, { value: numericValue * 0.75, unit: 'pt', label: '(pt)' }, { value: numericValue / 37.795, unit: 'cm', label: '(cm)' }, { value: numericValue / 3.7795, unit: 'mm', label: '(mm)' }, { value: numericValue / 96, unit: 'in', label: '(in)' });
            break;
        case 'rem':
            conversions.push({ value: numericValue * baseFontSize, unit: 'px', label: '(px)' }, { value: numericValue, unit: 'em', label: '(em)' }, { value: numericValue * baseFontSize * 0.75, unit: 'pt', label: '(pt)' });
            break;
        case 'em':
            conversions.push({ value: numericValue * baseFontSize, unit: 'px', label: '(px)' }, { value: numericValue, unit: 'rem', label: '(rem)' }, { value: numericValue * baseFontSize * 0.75, unit: 'pt', label: '(pt)' });
            break;
        case 'vh':
            conversions.push({ value: (numericValue / 100) * viewportHeight, unit: 'px', label: '(px)' }, { value: numericValue, unit: 'vw', label: '(vw - if square viewport)' });
            break;
        case 'vw':
            conversions.push({ value: (numericValue / 100) * viewportWidth, unit: 'px', label: '(px)' }, { value: numericValue, unit: 'vh', label: '(vh - if square viewport)' });
            break;
        case '%':
            conversions.push({ value: numericValue, unit: '%', label: '(relative to parent)' });
            break;
        case 'pt':
            conversions.push({ value: numericValue * 1.333, unit: 'px', label: '(px)' }, { value: (numericValue * 1.333) / baseFontSize, unit: 'rem', label: '(rem)' });
            break;
        case 'cm':
            conversions.push({ value: numericValue * 37.795, unit: 'px', label: '(px)' }, { value: numericValue * 10, unit: 'mm', label: '(mm)' }, { value: numericValue / 2.54, unit: 'in', label: '(in)' });
            break;
        case 'mm':
            conversions.push({ value: numericValue * 3.7795, unit: 'px', label: '(px)' }, { value: numericValue / 10, unit: 'cm', label: '(cm)' }, { value: numericValue / 25.4, unit: 'in', label: '(in)' });
            break;
        case 'in':
            conversions.push({ value: numericValue * 96, unit: 'px', label: '(px)' }, { value: numericValue * 2.54, unit: 'cm', label: '(cm)' }, { value: numericValue * 25.4, unit: 'mm', label: '(mm)' });
            break;
        default:
            return null;
    }
    return {
        value: conversions[0]?.value || numericValue,
        unit: conversions[0]?.unit || unit,
        displayText: `${numericValue}${unit} = ${conversions[0]?.value.toFixed(getDecimalPlaces(conversions[0]?.unit || unit))}${conversions[0]?.unit || unit}`,
        originalValue: numericValue,
        originalUnit: unit,
        conversions: conversions
    };
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map