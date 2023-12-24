import * as vscode from "vscode";
import { EditorProvider } from "./commands/editor";

export function activate(extensionContext: vscode.ExtensionContext) {

	extensionContext.subscriptions.push(EditorProvider.register(extensionContext));
}

// This method is called when your extension is deactivated
export function deactivate() { }

