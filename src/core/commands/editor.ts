import * as vscode from 'vscode';
import { ViewColumn, Uri } from 'vscode';

export class EditorProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new EditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider('dbunit.editor', provider);
        context.subscriptions.push(providerRegistration);

        const command = vscode.commands.registerCommand("dbunit-vscode-extension.editor", (uri?: Uri) => {
            uri ??= vscode.window.activeTextEditor?.document.uri;
            vscode.commands.executeCommand(
                'vscode.openWith',
                uri,
                'dbunit.editor',
                ViewColumn.Beside,
            );
        });

        context.subscriptions.push(command);

        return new vscode.Disposable(() => {
            // provider.dispose();
            providerRegistration.dispose();
            command.dispose();
        });
    }

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }


    public async resolveCustomTextEditor(document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken): Promise<void> {

        webviewPanel.webview.options = {
            enableScripts: true,
        };
        const view = this.getHtmlForWebview(webviewPanel);
        webviewPanel.webview.html = view;

        function updateWebview() {
            console.log(document.getText())
            webviewPanel.webview.postMessage({
                type: "update",
                xml: document.getText(),
            });
        }

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                // 変更前後の内容が複数回交互に発生するため、元ファイルからの変更はCustomEditorに
                // 自動反映しないようコメントアウトする
                // updateWebview();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage((event?: { type: string, text: string }) => {
            if (!event) return;

            switch (event.type) {
                case 'apply':
                    if (document.getText() !== event.text) {
                        this.save(document, event.text);
                    }
                    return;
                case 'ready':
                    console.log(document.getText());
                    const xml = document.getText();
                    webviewPanel.webview.postMessage({ type: "load", xml });
                    return;
            }

        });
    }

    private save(document: vscode.TextDocument, textModified: string) {

        const edit = new vscode.WorkspaceEdit();

        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            textModified);

        return vscode.workspace.applyEdit(edit);
    }

    private getHtmlForWebview(panel: vscode.WebviewPanel): string {

        const webviewSrc = panel.webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'dist', 'view', 'preview.js'));

        return /* html */`<!DOCTYPE html>
        <html lang="ja">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>title</title>
          </head>
          <body>
            <div id="root"></div>
            <script defer src="${webviewSrc}"></script>
          </body>
        </html>`;
    }
}

