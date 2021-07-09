package server

import (
	"context"
	"net"

	"github.com/badgerodon/tasks/pkg/pb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (srv *Server) runGRPC(ctx context.Context, li net.Listener) error {
	srv.grpcServer = grpc.NewServer()
	pb.RegisterTasksServer(srv.grpcServer, srv)

	srv.grpcWebServer = grpcweb.WrapServer(srv.grpcServer)

	log.Info().Str("addr", li.Addr().String()).Msg("serving gRPC")
	return srv.grpcServer.Serve(li)
}

// viewing
func (srv *Server) DeleteTask(ctx context.Context, req *pb.DeleteTaskRequest) (*emptypb.Empty, error) {
	return srv.cfg.database.DeleteTask(ctx, req)
}

func (srv *Server) GetTask(ctx context.Context, req *pb.GetTaskRequest) (*pb.GetTaskResponse, error) {
	return srv.cfg.database.GetTask(ctx, req)
}

func (srv *Server) ListTasks(ctx context.Context, req *pb.ListTasksRequest) (*pb.ListTasksResponse, error) {
	return srv.cfg.database.ListTasks(ctx, req)
}

// leasing
func (srv *Server) CompleteTask(ctx context.Context, req *pb.CompleteTaskRequest) (*emptypb.Empty, error) {
	return srv.cfg.database.CompleteTask(ctx, req)
}

func (srv *Server) LeaseTask(ctx context.Context, req *pb.LeaseTaskRequest) (*pb.LeaseTaskResponse, error) {
	return srv.cfg.database.LeaseTask(ctx, req)
}

func (srv *Server) RenewTaskLease(ctx context.Context, req *pb.RenewTaskLeaseRequest) (*emptypb.Empty, error) {
	return srv.cfg.database.RenewTaskLease(ctx, req)
}

func (srv *Server) SubmitTask(ctx context.Context, req *pb.SubmitTaskRequest) (*emptypb.Empty, error) {
	return srv.cfg.database.SubmitTask(ctx, req)
}

// logs
func (srv *Server) AppendTaskLogs(ctx context.Context, req *pb.AppendTaskLogsRequest) (*emptypb.Empty, error) {
	return srv.cfg.database.AppendTaskLogs(ctx, req)
}

func (srv *Server) GetTaskLogs(ctx context.Context, req *pb.GetTaskLogsRequest) (*pb.GetTaskLogsResponse, error) {
	return srv.cfg.database.GetTaskLogs(ctx, req)
}
