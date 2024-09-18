import * as vscode from 'vscode';
import { handleWorkspace, sendWorkspacePathForAnalysis } from './workspace_utils';
import { performSearchAndDisplay } from './search_utils';

/**
 * Activates the extension.
 * 
 * This function is called when the extension is activated. It registers the commands and sets up event listeners
 * for workspace changes. It also triggers an initial analysis if a workspace is already open when VS Code is launched.
 * 
 * @param context - The extension context provided by VS Code.
 */
export function activate(context: vscode.ExtensionContext) {
    // Register the command to trigger
    let disposable = vscode.commands.registerCommand('bogosort.search', async () => {
        const workspacePath = handleWorkspace();
        // Show input box to get user's search query
        const searchQuery = await vscode.window.showInputBox({ prompt: 'Enter your search query' });

        if (searchQuery && workspacePath) {
            // Perform search (for now, we'll simulate it)
            performSearchAndDisplay(searchQuery, workspacePath, context);

        }
    });

    // Trigger when VS Code is first launched and a workspace is already open
    if (vscode.workspace.workspaceFolders) {
        const projectDirectory = handleWorkspace();
        if (projectDirectory !== undefined) {
            sendWorkspacePathForAnalysis(projectDirectory);
        }

        // Event listener for when workspace folders are added or removed
        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            if (event.added.length > 0) {
                const workspacePath = event.added[0].uri.fsPath;
                sendWorkspacePathForAnalysis(workspacePath);
            }
        });

        // Command to trigger the analysis manually (optional)
        context.subscriptions.push(
            vscode.commands.registerCommand('bogosort.scan', () => {
                const workspacePath = handleWorkspace();
                if (workspacePath !== undefined) {
                    sendWorkspacePathForAnalysis(workspacePath);
                }
            })
        );

        context.subscriptions.push(disposable);
    }
}

export function deactivate() { };