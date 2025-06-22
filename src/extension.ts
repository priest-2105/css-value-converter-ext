import * as vscode from 'vscode';

interface ConversionResult {
  value: number;
  unit: string;
  displayText: string;
}

export function activate(context: vscode.ExtensionContext) {
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

function convertCssUnit(value: string): ConversionResult | null {
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
  const baseFontSize = config.get<number>('baseFontSize', 16);
  const viewportHeight = config.get<number>('viewportHeight', 900);
  const viewportWidth = config.get<number>('viewportWidth', 1440);

  let convertedValue: number;
  let convertedUnit: string;
  let displayText: string;

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

export function deactivate() {}