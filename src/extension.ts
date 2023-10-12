// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    //####### Section Header: Global Variables #######
// Define a user-global variable for the author's name.
let storedAuthorName = context.globalState.get<string>('authorName');

// If the author's name is not stored, prompt the user to enter it.
if (!storedAuthorName) {
    //####### Section Header: Prompt for Author's Name #######
    const authorName = await vscode.window.showInputBox({
        placeHolder: 'Enter your name',
        prompt: 'Please enter your name (Author):'
    });

    if (authorName) {
        storedAuthorName = authorName;
        context.globalState.update('authorName', authorName);
    }
}

//####### Section Header: Register Commands #######
// Register the "generateFiles" command.
const authorName = context.globalState.get<string>('authorName') || '';

// Register the "generateLicense" command and specify the function to be executed.
context.subscriptions.push(vscode.commands.registerCommand('tg.generateLicense', () => {
    generateLicense(context, authorName);
}));

// Register the "generateREADME" command and specify the function to be executed.
context.subscriptions.push(vscode.commands.registerCommand('tg.generateREADME', () => {
    generateREADME(context);
}));

// Register the "generateBoth" command and specify the function to be executed.
context.subscriptions.push(vscode.commands.registerCommand('tg.generateBoth', () => {
    generateLicense(context, authorName);
    generateREADME(context);
}));

}

// async function getUserAuthorName(context: vscode.ExtensionContext) {
//     let storedAuthorName = context.globalState.get<string>('authorName');

//     if (!storedAuthorName) {
//         const authorName = await vscode.window.showInputBox({
//             placeHolder: 'Enter your name',
//             prompt: 'Please enter your name (Author):'
//         });

//         if (authorName) {
//             storedAuthorName = authorName;
//             context.globalState.update('authorName', authorName);
//         }
//     }
// }

function generateLicense(context: vscode.ExtensionContext, authorName: string) {
    // License generation logic
    console.log('generateLicense function called');
    const currentYear = new Date().getFullYear();

    const mitLicense = `
    MIT License

    Copyright (c) ${currentYear} ${authorName}

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    `;

    fs.writeFileSync('LICENSE', mitLicense, 'utf-8');
}


function generateREADME(context: vscode.ExtensionContext) {
    // Create variables to store user inputs with default values.
    let projectTitle: string = "My Project";
    let projectDescription: string = "A project description";
    let projectFeatures: string[] = [];

    // Step 1: Introduction and Purpose
    vscode.window.showInformationMessage('Welcome to the README generation wizard. Let\'s get started.');

    // Step 2: Project Title and Description
    vscode.window.showInputBox({ prompt: 'Enter the project title' }).then((title) => {
        if (title) {
            projectTitle = title;
            vscode.window.showInputBox({ prompt: 'Enter a project description' }).then((description) => {
                if (description) {
                    projectDescription = description;
                }

                // Step 3: Features
                showFeaturePrompt();
            });
        } else {
            // The user canceled the input, you can handle this as needed.
        }
    });


	function showFeaturePrompt() {
        vscode.window.showInputBox({ prompt: 'Enter a project feature (or leave it empty to proceed)' }).then((feature) => {
            if (feature !== undefined) {
                if (feature.trim() !== '') {
                    projectFeatures.push(feature);
                }
                // Step 4: Table of Contents (generate based on collected data)
                const tableOfContents = `## Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [Contributing](#contributing)\n- [License](#license)\n`;

                // Step 5: Installation Instructions (gather user input)
                vscode.window.showInputBox({ prompt: 'Enter installation instructions' }).then((installation) => {
                    if (installation !== undefined) {
                        // Step 6: Usage Instructions (gather user input)
                        vscode.window.showInputBox({ prompt: 'Enter usage instructions' }).then((usage) => {
                            if (usage !== undefined) {
                                // Step 7: Contributing Guidelines (gather user input)
                                vscode.window.showInputBox({ prompt: 'Enter contributing guidelines' }).then((contributing) => {
                                    if (contributing !== undefined) {
                                        // Step 8: License Selection (gather user input)
                                        vscode.window.showInputBox({ prompt: 'Enter the license (e.g., MIT)' }).then((license) => {
                                            if (license !== undefined) {
                                                // Step 9: Contact Information (gather user input)
                                                vscode.window.showInputBox({ prompt: 'Enter contact information' }).then((contact) => {
                                                    if (contact !== undefined) {
                                                        // Step 10: Generate README with user inputs
                                                        const generatedREADME = generateREADMEContent(projectTitle, projectDescription, projectFeatures, tableOfContents, installation, usage, contributing, license, contact);

                                                        // Step 11: Display the Generated README
                                                        const readmeUri = vscode.Uri.parse('untitled:' + 'README.md');
                                                        vscode.workspace.openTextDocument(readmeUri).then((doc) => {
                                                            vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then((editor) => {
                                                                editor.edit((editBuilder) => {
                                                                    editBuilder.insert(new vscode.Position(0, 0), generatedREADME);
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                
            }
        });
    }
}
// ... (continue with other functions for generating README content)

function generateREADMEContent(projectTitle: string, projectDescription: string, projectFeatures: string[], tableOfContents: string, installation: string, usage: string, contributing: string, license: string, contact: string) {
    // Generate the README content using the collected user inputs.
    // Return the complete README content as a string.

    const featuresSection = projectFeatures.length > 0
        ? `## Features\n\n${projectFeatures.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}\n\n`
        : '';

    const installationSection = `## Installation\n\n${installation}\n\n`;

    const usageSection = `## Usage\n\n${usage}\n\n`;

    const contributingSection = `## Contributing\n\n${contributing}\n\n`;

    const licenseSection = `## License\n\nThis project is licensed under the [${license} License](LICENSE).\n\n`;

    const contactSection = `## Contact\n\n${contact}\n\n`;

    return `# ${projectTitle}\n\n${projectDescription}\n\n${tableOfContents}${featuresSection}${installationSection}${usageSection}${contributingSection}${licenseSection}${contactSection}`;
}


export function deactivate() {
    // This method is called when your extension is deactivated
}