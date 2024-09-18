import * as vscode from 'vscode';
import axios from 'axios';

// Method to make a POST request to the backend
async function searchCodebase(query: string, projectPath: string) {
    try {
        const response = await axios.post('http://localhost:8000/search',
            {
                query,
                project_path: projectPath
            }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });

        // If the response is successful, return the data (the search results)
        vscode.window.showInformationMessage(`Search completed: ${response.data.length} results found.`);
        return response.data.message;
    } catch (error) {
        vscode.window.showErrorMessage(`Error while searching the codebase: ${error}`);
        return [];
    }
}


// Function to perform the search and display the results
async function performSearchAndDisplay(query: string, projectPath: string, context: vscode.ExtensionContext) {
    // Call the search function
    const searchResults = await searchCodebase(query, projectPath);

    // Generate the HTML for displaying the results
    const searchResultsHTML = getSearchResultsHTML(searchResults);

    // Create a webview panel to display the search results
    const panel = vscode.window.createWebviewPanel(
        'searchResults',
        'Search Results',
        vscode.ViewColumn.One,
        {}
    );

    // Set the HTML content of the panel
    panel.webview.html = searchResultsHTML;

    // Handle message when a search result is clicked
    panel.webview.onDidReceiveMessage((message) => {
        if (message.index !== undefined) {
            vscode.window.showInformationMessage(`Message received: ${message.index}`);
            const result = searchResults[message.index];  // Retrieve the result from the list
            handleSearchResultNavigation(result);
        }
    }, undefined, context.subscriptions);
}

function getSearchResultsHTML(results: any[]) {
    let html = `
    <html>
    <head>
        <style>
            .card {
    border: 1px solid #bbbaba;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ffffff;
}
.card:hover {
    border-color: #def2ff;
    background-color: #bbbaba;
    color: black;
}
.card-container {
    display: flex;
    flex-direction: column;
}
.title {
    margin: 0;
    padding: 0;
    color: #007acc;
    border-bottom: 1px solid #bbbaba;
}
        </style>
    </head>
    <body>
        <h1>Search Results</h1>
        <div class="card-container">
            ${results.map((result, index) => `
            <h3 class="title">${result.file}</h3>
                <div>
                    ${innerHtml(result.data, result.file, index)}
                </div>
            `).join('')}
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            function sendMessage(index, file, indexOfFile) {
        vscode.window.showInformationMessage("Message sent: " +"index: " + index + " file: " + file + " indexOfFile: " indexOfFile);
    }
        </script>
    </body>
    </html>
    `;
    return html;
}


function innerHtml(results: any[], file: string, indexOfFile: number) {
    let innerhtml = '';
    results.forEach((result, index) => {
        innerhtml += `<div class="card" onclick="sendMessage(${index}, ${file}, ${indexOfFile})">`;
        let innerCard = `<li>name: ${result.name}</li>`;
        innerCard += `<li>signature: ${result.signature}</li>`;
        innerCard += `<li>type: ${result.type}</li>`;
        innerCard += `<li>start line: ${result.start_line}</li>`;
        innerCard += `<li>end line: ${result.end_line}</li>`;

        innerhtml += innerCard + '</div>';
    });

    return innerhtml;
}

// This function handles navigation when a search result is clicked
const handleSearchResultNavigation = (result: any) => {
    const fileUri = vscode.Uri.file(result.file);
    const startLine = result.data.start_line;
    const endLine = result.data.end_line;

    vscode.window.showInformationMessage(`Opening file: ${result.file}, starting at line ${startLine}`);

    vscode.workspace.openTextDocument(fileUri).then((doc) => {
        vscode.window.showTextDocument(doc).then((editor) => {
            const startPosition = new vscode.Position(startLine - 1, 0);  // Line numbers are 0-based
            const endPosition = new vscode.Position(endLine - 1, 0);

            editor.selection = new vscode.Selection(startPosition, endPosition);
            editor.revealRange(new vscode.Range(startPosition, endPosition));
        });
    });
};

export { searchCodebase, performSearchAndDisplay, getSearchResultsHTML, handleSearchResultNavigation };
