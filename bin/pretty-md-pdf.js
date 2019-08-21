#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const yargs = require("yargs")

const exportTypes = require("../export-types.json")
const prettyMdPdf = require("../")
const prettyMdPdfMetadata = require("../package.json")

function getVersionFromPackageJson() {
    return prettyMdPdfMetadata.version
}

function parseArguments() {
    return yargs.version(getVersionFromPackageJson())
        .epilogue(`Convert from markdown to ${exportTypes.join("/")} with pretty styles`)
        .option("input", {
            alias: "i",
            describe: "Path to a valid markdown file",
            type: "string"
        })
        .option("output", {
            alias: "o",
            describe: "Output file path",
            type: "string"
        })
        .options("output-type", {
            alias: "t",
            describe: "Format to export",
            default: "pdf",
            choices: exportTypes
        })
        .options("chromium-args", {
            alias: "a",
            describe: "Arguments to pass to Chromium when running Puppeteer",
            default: null,
            type: "string"
        })
        .option("config", {
            alias: "c",
            describe: "Path to the JSON config file to use",
            type: "string",
            default: path.join(__dirname, "..", "config.json")
        })
        .demandOption("input")
        .argv
}

function getOptions() {
    let args = parseArguments()
    let outputDirectory = args["output-path"]

    if (outputDirectory) {
        if ((!fs.existsSync(outputDirectory) || !(fs.statSync(outputDirectory).isDirectory()))) {
            throw new Error(`[pretty-md-pdf] ERROR: Output directory '${outputDirectory}' does not exist or is not a directory`)
        }

        config.outputDirectory = outputDirectory
    }

    let chromiumArgs = undefined

    if (args['chromium-args']) {
        chromiumArgs = JSON.parse(args['chromium-args'])
    }

    return {
        markdownFilePath: args.input,
        outputFilePath: args.output,
        outputFileType: args["output-type"],
        chromiumArgs,
        configFilePath: args.config
    }
}

async function main() {
    await prettyMdPdf.convertMd(
        getOptions()
    )
}

main()
