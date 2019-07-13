#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const prettyMdPdf = require("../")
const yargs = require("yargs")

function getVersionFromPackageJson() {
    return require(path.join(__dirname, "..", "package.json")).version
}

function parseArguments() {
    return yargs.version(getVersionFromPackageJson())
        .option("input", {
            alias: "i",
            describe: "Path to a valid markdown file",
            type: "string"
        })
        .option("output-path", {
            alias: "o",
            describe: "Path to output the PDF to",
            type: "string"
        })
        .option("config", {
            alias: "c",
            describe: "Path to the JSON config file to use",
            type: "string"
        })
        .demandOption("input")
        .argv
}

function getInputFileAndConfig() {
    let args = parseArguments()
    let outputDirectory = args["output-path"]

    if (outputDirectory) {
        if ((!fs.existsSync(outputDirectory) || !(fs.statSync(outputDirectory).isDirectory()))) {
            throw new Error(`[pretty-md-pdf] ERROR: Output directory '${outputDirectory}' does not exist or is not a directory`)
        }

        config.outputDirectory = path.resolve(outputDirectory)
    }

    return {
        inputFile: path.resolve(args.input),
        configPath: args["config"] || path.join(__dirname, "..", "config.json")
    }
}

function main() {
    let inputFileAndConfig = getInputFileAndConfig()

    prettyMdPdf.convertMdToPdf(
        inputFileAndConfig.inputFile,
        inputFileAndConfig.configPath
    )
}

main()
