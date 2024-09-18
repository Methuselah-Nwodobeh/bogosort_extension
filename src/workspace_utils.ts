import * as vscode from 'vscode';
import * as http from 'http';

// Function to send the workspace path to the backend
const sendWorkspacePathForAnalysis = (workspacePath: string) => {
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: `/analyze?project_path=${encodeURIComponent(workspacePath)}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        // Collect the response data
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Log the response when it's received
        res.on('end', () => {
            vscode.window.showInformationMessage(`Codebase analysis completed: ${data}`);
        });
    });

    // Handle request errors
    req.on('error', (error) => {
        vscode.window.showErrorMessage(`Error analyzing project: ${error.message}`);
    });

    req.end();
    // return req.
};

// Function to get the current workspace folder and send the path
const handleWorkspace = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const workspacePath = workspaceFolders[0].uri.fsPath;
        return workspacePath;
    } else {
        vscode.window.showErrorMessage('No workspace folder is open.');
    }
};



export { handleWorkspace, sendWorkspacePathForAnalysis };
export function deactivate() { }
