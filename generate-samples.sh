#! /usr/bin/env sh
set -e

./bin/pretty-md-pdf.js -i README.md -t pdf -o sample/README.pdf
./bin/pretty-md-pdf.js -i README.md -t jpeg -o sample/README.jpeg
./bin/pretty-md-pdf.js -i README.md -t png -o sample/README.png
./bin/pretty-md-pdf.js -i README.md -t html -o sample/README.html
