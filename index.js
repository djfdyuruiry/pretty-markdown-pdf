const fs = require("fs")
const markdownPdf = require("./markdown-pdf")
const path = require("path")

module.exports = {
    convertMdToPdf: async (markdownFilePath, configFilePath) => {
        if (!markdownFilePath || !markdownFilePath.toLowerCase().endsWith(".md") || !fs.existsSync(markdownFilePath)) {
            throw new Error(`[pretty-md-pdf] ERROR: Markdown file '${markdownFilePath}' does not exist or is not an '.md' file`)
        }

        let configPath = configFilePath || path.join(__dirname, "..", "config.json")

        if (!configPath || !fs.existsSync(configPath)) {
            throw new Error(`[pretty-md-pdf] ERROR: Config file '${configPath}' does not exist`)
        }

        let config = JSON.parse(
            fs.readFileSync(configPath).toString()
        )

        console.log(`[pretty-md-pdf] Converting markdown file to pdf: ${markdownFilePath}`)

        await markdownPdf.init(config)
        await markdownPdf.convertMarkdownToPdf(markdownFilePath, config)

        let outputPath = config.outputDirectory ? path.join(config.outputDirectory, path.basename(markdownFilePath).replace(/[.]md$/, ".pdf")) :
            markdownFilePath.replace(/[.]md$/, ".pdf")

        console.log(`[pretty-md-pdf] Converted markdown file to pdf: ${outputPath}`)
    }
}
