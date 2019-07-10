# Pretty Markdown PDF

Easy to use tool to convert a markdown file to a pretty looking PDF.

The majority of this tool is based on the [vscode-markdown-pdf](https://github.com/yzane/vscode-markdown-pdf) Visual Studio Code extension, which provides the pretty styles and exra markdown features.

![PDF](img/pdf.png)

## Features

Supports the following features
* [Syntax highlighting](https://highlightjs.org/static/demo/)
* [emoji](http://www.webpagefx.com/tools/emoji-cheat-sheet/)
* [markdown-it-checkbox](https://github.com/mcecot/markdown-it-checkbox)
* [markdown-it-container](https://github.com/markdown-it/markdown-it-container)
* [PlantUML](http://plantuml.com/)
  * [markdown-it-plantuml](https://github.com/gmunguia/markdown-it-plantuml)

[Sample pdf file](sample/README.pdf)

### markdown-it-container

INPUT
```
::: warning
*here be dragons*
:::
```

OUTPUT
``` html
<div class="warning">
<p><em>here be dragons</em></p>
</div>
```

### markdown-it-plantuml

INPUT
```
@startuml
Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok
@enduml
```

OUTPUT

![PlantUML](img/PlantUML.png)

## Usage

Install this project from the NPM package repository:

```bash
npm install -g pretty-markdown-pdf
```

### Command Line

To convert a markdown file to PDF, simply run:

```bash
pretty-md-pdf -i my-doc.md
```

*Run with `--help` to see all the options available.*

This will output a file `my-doc.pdf` in the directory where `my-doc.md` resides.

To specify an output directory for `my-doc.pdf`, run:

```bash
pretty-md-pdf -i my-doc.md -o /tmp
```

Now `my-doc.pdf` will output to

### Javascript

You can programmatically call this package, example:

```javascript
const path = require("path")
const prettyMdPdf = require("pretty-markdown-pdf")

let inputFile = "my-doc.md"
let outputDirectory = "./" // optional

// all paths passed to `convertMdToPdf` must be absolute
let inputFilePath = path.resolve(inputFile)
let outputPath = path.resolve(outputDirectory)

prettyMdPdf.convertMdToPdf(inputFilePath, outputPath)
```

## Note on Chromium

Chromium download starts automatically before the first conversion; this is a one time operation, only if your reinstall this package will it be downloaded again.

This isa  time-consuming task depending on the environment because of its large size (~ 170Mb Mac, ~ 282Mb Linux, ~ 280Mb Win).

During the Chromuim download, the message `Installing Chromium` will be displayed in the console.
