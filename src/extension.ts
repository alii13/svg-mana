import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'svgCurrentColor.replaceColors',
        async () => {
            const editor = vscode.window.activeTextEditor
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found.')
                return
            }

            const document = editor.document
            if (
                document.languageId !== 'xml' ||
                !document.fileName.endsWith('.svg')
            ) {
                vscode.window.showErrorMessage(
                    'This command is only available for SVG files.'
                )
                return
            }

            const text = document.getText()
            const modifiedText = replaceColorsWithCurrentColor(text)

            const edit = new vscode.WorkspaceEdit()
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            )

            edit.replace(document.uri, fullRange, modifiedText)
            await vscode.workspace.applyEdit(edit)

            vscode.window.showInformationMessage(
                'SVG colors replaced with currentColor!'
            )
        }
    )

    context.subscriptions.push(disposable)
}

function replaceColorsWithCurrentColor(svgContent: string): string {
    // Ensure `fill` is replaced with `currentColor`, but preserve white (#fff, #FFF, #FFFFFF)
    svgContent = svgContent.replace(
        /fill="(?!none)(?!#fff[^\w])(?!#FFF[^\w])(?!#ffffff[^\w])(?!#FFFFFF[^\w])#[0-9a-fA-F]{3,8}"/gi,
        'fill="currentColor"'
    )

    // Ensure `stroke` is replaced with `currentColor`, but preserve white (#fff, #FFF, #FFFFFF)
    svgContent = svgContent.replace(
        /stroke="(?!none)(?!#fff[^\w])(?!#FFF[^\w])(?!#ffffff[^\w])(?!#FFFFFF[^\w])#[0-9a-fA-F]{3,8}"/gi,
        'stroke="currentColor"'
    )

    // Ensure inline styles (`style="fill: ..."`) preserve white while replacing all other colors
    svgContent = svgContent.replace(
        /style="[^"]*?(fill|stroke):\s*(?!#fff[^\w])(?!#FFF[^\w])(?!#ffffff[^\w])(?!#FFFFFF[^\w])#[0-9a-fA-F]{3,8}[^"]*?"/gi,
        ''
    )

    return svgContent
}

export function deactivate() {}
