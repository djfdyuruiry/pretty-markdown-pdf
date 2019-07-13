#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const prettyMdPdf = require("../")
const yargs = require("yargs")

function loadConfig(args) {
    let configPath = args["config"] || path.join(__dirname, "..", "config.json")

    if (!configPath || !fs.existsSync(configPath)) {
        throw new Error(`[pretty-md-pdf] ERROR: Config file '${configPath}' does not exist`)
    }

    return JSON.parse(
        fs.readFileSync(configPath).toString()
    )
}

function getVersionFromPackageJson() {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "..", "package.json"),
            "utf8"
        )
    ).version
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
    let config = loadConfig(args)
    let outputDirectory = args["output-path"]

    if (outputDirectory) {
        if ((!fs.existsSync(outputDirectory) || !(fs.statSync(outputDirectory).isDirectory()))) {
            throw new Error(`[pretty-md-pdf] ERROR: Output directory '${outputDirectory}' does not exist or is not a directory`)
        }

        config.outputDirectory = path.resolve(outputDirectory)
    }

    return {
        inputFile: path.resolve(args.input),
        config
    }
}

function main() {
    let inputFileAndConfig = getInputFileAndConfig()

    prettyMdPdf.convertMdToPdf(
        inputFileAndConfig.inputFile,
        inputFileAndConfig.config
    )
}

main()
