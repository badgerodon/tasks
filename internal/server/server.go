package server

import (
	"context"
	"fmt"
	"net"
	"net/http"

	"github.com/badgerodon/tasks/pkg/pb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/soheilhy/cmux"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
)

// A Server implements the tasks server.
type Server struct {
	pb.UnimplementedTasksServer

	cfg *config

	grpcServer    *grpc.Server
	grpcWebServer *grpcweb.WrappedGrpcServer
	httpServer    *http.Server
}

// New creates a new server.
func New(options ...Option) *Server {
	srv := &Server{
		cfg: newConfig(options...),
	}

	return srv
}

// Run runs the server.
func (srv *Server) Run(ctx context.Context) error {
	li, err := net.Listen("tcp", srv.cfg.bindAddr)
	if err != nil {
		return fmt.Errorf("failed to create listener: %w", err)
	}
	defer func() { _ = li.Close() }()

	mux := cmux.New(li)

	grpcli := mux.Match(cmux.HTTP2HeaderField("Content-Type", "application/grpc"))
	httpli := mux.Match(cmux.Any())

	eg, ctx := errgroup.WithContext(ctx)
	eg.Go(func() error {
		return srv.runGRPC(ctx, grpcli)
	})
	eg.Go(func() error {
		return srv.runHTTP(ctx, httpli)
	})
	eg.Go(func() error {
		return mux.Serve()
	})
	return eg.Wait()
}
