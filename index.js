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
    convertMdToPdf: markdownFilePath => {
        if (!markdownFilePath || !markdownFilePath.toLowerCase().endsWith(".md") || !fs.existsSync(markdownFilePath)) {
            throw new Error(`[pretty-md-pdf] ERROR: Markdown file '${markdownFilePath}' does not exist or is not an '.md' file`);
        }

        // Mock out the vscode module:
        //   - capture commands as entry point to trigger pdf conversion
        //   - pretend we have a markdown file open @ `markdownFilePath`
        //   - mock message writers using console
        //   - read in file text and provide paths/URIs
        //   - handle async execution from extension
        const vscode = {
            workspace: {
                getConfiguration: function() {
                    return {
                        "type": [
                            "pdf"
                        ],
                        "convertOnSave": false,
                        "convertOnSaveExclude": [],
                        "outputDirectory": "",
                        "outputDirectoryRelativePathFile": false,
                        "styles": [],
                        "stylesRelativePathFile": false,
                        "includeDefaultStyles": true,
                        "highlight": true,
                        "highlightStyle": "",
                        "breaks": false,
                        "emoji": true,
                        "executablePath": "",
                        "scale": 1,
                        "displayHeaderFooter": true,
                        "headerTemplate": "<div style=\"font-size: 9px; margin-left: 1cm;\"> <span class='title'></span></div> <div style=\"font-size: 9px; margin-left: auto; margin-right: 1cm; \"> <span class='date'></span></div>",
                        "footerTemplate": "<div style=\"font-size: 9px; margin: 0 auto;\"> <span class='pageNumber'></span> / <span class='totalPages'></span></div>",
                        "printBackground": true,
                        "orientation": "portrait",
                        "pageRanges": "",
                        "format": "A4",
                        "width": "",
                        "height": "",
                        "margin": "1cm",
                        "quality": 100,
                        "clip": {
                            "height": null
                        },
                        "omitBackground": false,
                        "StatusbarMessageTimeout": 10000
                    }
                },
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
                        getText: function() {
                            return fs.readFileSync(markdownFilePath, "utf8")
                        },
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
        markdownPdf.init()
        markdownPdf.convertMarkdownToPdf()

        console.log(`[pretty-md-pdf] Converted markdown file to pdf: ${markdownFilePath.replace(/[.]md$/, ".pdf")}`)
    }
}
