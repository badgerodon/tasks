package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/badgerodon/tasks/ui"
	chi "github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()
	r.HandleFunc("/twirp/*", handleTwirp)
	r.Get("/*", handleFiles)
	fmt.Println("starting server")
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s", err.Error())
		os.Exit(1)
	}
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
	nm := "build" + r.URL.Path
	if nm == "build/" {
		nm = "build/index.html"
	}

	f, err := ui.FS.Open(nm)
	if err != nil {
		http.Error(w, "path not found", http.StatusNotFound)
		return
	}
	defer f.Close()

	fi, err := f.Stat()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	bs, err := io.ReadAll(f)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h := sha256.Sum256(bs)
	etag := hex.EncodeToString(h[:])
	w.Header().Set("ETag", `"`+etag+`"`)

	http.ServeContent(w, r, nm, fi.ModTime(), bytes.NewReader(bs))
}

func handleTwirp(w http.ResponseWriter, r *http.Request) {
}
