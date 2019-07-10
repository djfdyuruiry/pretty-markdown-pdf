#! /usr/bin/env node
const fs = require("fs")
const path = require("path")
const prettyMdPdf = require("../")
const yargs = require("yargs")

// load version number from package.json
const version = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "..", "package.json"),
        "utf8"
    )
).version

let args = yargs.version(version)
    .option("input", {
        alias: "i",
        describe: "Path to a valid markdown file",
        type: "string"
    })
    .demandOption("input")
    .argv

let markdownPath = path.resolve(args.input)

prettyMdPdf.convertMdToPdf(markdownPath)
