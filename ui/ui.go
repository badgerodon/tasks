package ui

import "embed"

//go:embed build/dist/index.css build/dist/index.js build/index.html
var FS embed.FS
