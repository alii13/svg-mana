# SVG CurrentColor Replacer

This VS Code extension transforms SVG to use currentColor instead of specific colors.

## Features

-   Right-click on an open SVG file and select **"Transform using svg mana"**.
-   Replaces intelligently fill and stroke colors with currentColor.
-   Works seamlessly within VS Code.

## How to Use

1. Open any `.svg` file in VS Code.
2. Right-click inside the editor.
3. Click **"Transform using svg mana"**.
4. The color values in the SVG will be updated.

## Installation

To install from a `.vsix` file:

```sh
npm run compile
vsce package
code --install-extension svg-current-color-0.0.1.vsix
```

if vsce is not installed, run

```sh
npm install -g @vscode/vsce
```
