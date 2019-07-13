/**
 * Wrapper around the `markdown-pdf` vscode extension that allows
 * calling from outside vscode using the node.js runtime on the
 * command line.
 */
const fs = require("fs")
const path = require("path")
const proxyquire =  require("proxyquire").noCallThru()
const URI = require("vscode-uri").URI

module.exports = {
    convertMdToPdf: (markdownFilePath, config) => {
        if (!markdownFilePath || !markdownFilePath.toLowerCase().endsWith(".md") || !fs.existsSync(markdownFilePath)) {
            throw new Error(`[pretty-md-pdf] ERROR: Markdown file '${markdownFilePath}' does not exist or is not an '.md' file`)
        }

        // Mock out the vscode module:
        //   - capture commands as entry point to trigger pdf conversion
        //   - pretend we have a markdown file open @ `markdownFilePath`
        //   - mock message writers using console
        //   - read in file text and provide paths/URIs
        //   - handle async execution from extension
        const vscode = {
            workspace: {
                getConfiguration: () => config,
                getWorkspaceFolder: function(uri) {
                    return {
                        index: 0,
                        name: path.basename(uri.path),
                        uri: URI.file(path.dirname(uri.path))
                    }
                }
            },
            ProgressLocation: {
                Notification: {}
            },
            Uri: {
                parse: function(uri) {
                    return URI.parse(uri)
                },
                file: function(uri) {
                    return URI.file(uri)
                }
            },
            window: {
                activeTextEditor: {
                    document: {
                        isUntitled: false,
                        languageId: "markdown",
                        uri: {
                            fsPath: markdownFilePath
                        }
                    }
                },
                setStatusBarMessage: function(msg) {
                    console.log(msg)

                    return {
                        dispose: function() {}
                    }
                },
                showErrorMessage: console.error,
                showInformationMessage: console.log,
                showWarningMessage: console.log,
                withProgress: async function(info, func) {
                    return await func()
                }
            }
        }

        vscode.commands = {
            registerCommand: function(name, func) {
                vscode.commands[name] = func
            }
        }

        // load extension using our vscode module mock
        const markdownPdf = proxyquire("./vscode-markdown-pdf", { "vscode": vscode })

        console.log(`[pretty-md-pdf] Converting markdown file to pdf: ${markdownFilePath}`)

        // call the vscode command to convert the current vscode file to pdf
        markdownPdf.init(config)
        markdownPdf.convertMarkdownToPdf(markdownFilePath, config)

        let outputPath = config.outputDirectory ? path.join(config.outputDirectory, path.basename(markdownFilePath).replace(/[.]md$/, ".pdf")) :
            markdownFilePath.replace(/[.]md$/, ".pdf")

        console.log(`[pretty-md-pdf] Converted markdown file to pdf: ${outputPath}`)
    }
}
