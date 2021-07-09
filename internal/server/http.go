package server

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net"
	"net/http"

	"github.com/badgerodon/tasks/ui"
	"github.com/rs/zerolog/log"
)

func (srv *Server) runHTTP(ctx context.Context, li net.Listener) error {
	srv.httpServer = &http.Server{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if srv.grpcWebServer.IsGrpcWebRequest(r) {
				srv.grpcWebServer.ServeHTTP(w, r)
				return
			}

			srv.ServeHTTP(w, r)
		}),
		BaseContext: func(_ net.Listener) context.Context {
			return ctx
		},
	}
	log.Info().Str("addr", li.Addr().String()).Msg("serving http")
	return srv.httpServer.Serve(li)
}

func (srv *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
