import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('svgCurrentColor.replaceColors', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'xml' || !document.fileName.endsWith('.svg')) {
            vscode.window.showErrorMessage('This command is only available for SVG files.');
            return;
        }

        const text = document.getText();
        const modifiedText = replaceColorsWithCurrentColor(text);

        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );

        edit.replace(document.uri, fullRange, modifiedText);
        await vscode.workspace.applyEdit(edit);

        vscode.window.showInformationMessage('SVG colors replaced with currentColor!');
    });

    context.subscriptions.push(disposable);
}

function replaceColorsWithCurrentColor(svgContent: string): string {
    // Replace `fill` color, but keep "none" and white colors as they are
    svgContent = svgContent.replace(/fill="(?!none)(?!#fff\b)(?!#FFF\b)(?!#ffffff\b)(?!#FFFFFF\b)[#0-9a-fA-F]{3,8}"/g, 'fill="currentColor"');

    // Replace `stroke` color, but keep "none" and white colors as they are
    svgContent = svgContent.replace(/stroke="(?!none)(?!#fff\b)(?!#FFF\b)(?!#ffffff\b)(?!#FFFFFF\b)[#0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"');

    // Remove inline styles that define `fill` or `stroke` colors, except for white
    svgContent = svgContent.replace(/style="[^"]*?(fill|stroke):(?!#fff\b)(?!#FFF\b)(?!#ffffff\b)(?!#FFFFFF\b)#[0-9a-fA-F]{3,8}[^"]*?"/g, '');

    return svgContent;
}



export function deactivate() {}
