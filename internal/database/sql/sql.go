package sql

import (
	"context"
	"database/sql"
	"fmt"
	"sync"

	"github.com/badgerodon/tasks/pkg/pb"
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"

	_ "modernc.org/sqlite"
)

type Database struct {
	pb.UnimplementedTasksServer

	cfg *config

	sqlOnce sync.Once
	sqlDB   *sql.DB
	sqlErr  error
}

func New(options ...Option) *Database {
	srv := &Database{
		cfg: newConfig(options...),
	}

	return srv
}

// viewing
func (srv *Database) DeleteTask(context.Context, *pb.DeleteTaskRequest) (*emptypb.Empty, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) GetTask(ctx context.Context, req *pb.GetTaskRequest) (*pb.GetTaskResponse, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) ListTasks(ctx context.Context, req *pb.ListTasksRequest) (*pb.ListTasksResponse, error) {
	return nil, fmt.Errorf("not implemented")
}

// leasing
func (srv *Database) CompleteTask(context.Context, *pb.CompleteTaskRequest) (*emptypb.Empty, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) LeaseTask(context.Context, *pb.LeaseTaskRequest) (*pb.LeaseTaskResponse, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) RenewTaskLease(context.Context, *pb.RenewTaskLeaseRequest) (*emptypb.Empty, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) SubmitTask(ctx context.Context, req *pb.SubmitTaskRequest) (*pb.SubmitTaskResponse, error) {
	sqlDB, err := srv.getDB(ctx)
	if err != nil {
		return nil, err
	}

	id := uuid.New().String()
	queueID := req.GetTask().GetQueueId()
	if queueID == "" {
		return nil, status.Errorf(codes.InvalidArgument, "task queue_id is required")
	}
	initiatorType := req.GetTask().GetInitiatorType().String()
	initiatorID := req.GetTask().GetInitiatorId()
	groupID := req.GetTask().GetGroupId()
	if groupID == "" {
		groupID = uuid.New().String()
	}
	taskStatus := pb.Task_NEW.String()
	name := req.GetTask().GetName()
	if name == "" {
		return nil, status.Errorf(codes.InvalidArgument, "task name is required")
	}
	createdAt := NullTimestamp{timestamppb.Now()}
	scheduledAt := NullTimestamp{req.GetTask().ScheduledAt}
	deadline := NullTimestamp{req.GetTask().Deadline}
	timeout := NullDuration{req.GetTask().Timeout}
	maxAttempts := NullInt32{req.GetTask().MaxAttempts}

	tx, err := sqlDB.Begin()
	if err != nil {
		return nil, err
	}

	err = insertTask(
		ctx,
		tx,
		id,
		queueID,
		initiatorType,
		initiatorID,
		groupID,
		taskStatus,
		name,
		createdAt,
		scheduledAt,
		deadline,
		timeout,
		maxAttempts,
	)
	if err != nil {
		_ = tx.Rollback()
		return nil, err
	}

	err = getTask(
		ctx,
		tx,
		id,
		&queueID,
		&initiatorType,
		&initiatorID,
		&groupID,
		&taskStatus,
		&name,
		&createdAt,
		&scheduledAt,
		&deadline,
		&timeout,
		&maxAttempts,
	)
	if err != nil {
		_ = tx.Rollback()
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return &pb.SubmitTaskResponse{
		Task: &pb.Task{
			Id:            id,
			QueueId:       queueID,
			InitiatorType: pb.Task_InitiatorType(pb.Task_InitiatorType_value[initiatorType]),
			InitiatorId:   initiatorID,
			GroupId:       groupID,
			Status:        pb.Task_Status(pb.Task_Status_value[taskStatus]),
			Name:          name,
			CreatedAt:     createdAt.ptr,
			ScheduledAt:   scheduledAt.ptr,
			Deadline:      deadline.ptr,
			Timeout:       timeout.ptr,
			MaxAttempts:   maxAttempts.ptr,
		},
	}, nil
}

// logs
func (srv *Database) AppendTaskLogs(context.Context, *pb.AppendTaskLogsRequest) (*emptypb.Empty, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) GetTaskLogs(context.Context, *pb.GetTaskLogsRequest) (*pb.GetTaskLogsResponse, error) {
	return nil, fmt.Errorf("not implemented")
}

func (srv *Database) getDB(ctx context.Context) (*sql.DB, error) {
	srv.sqlOnce.Do(func() {
		srv.sqlDB, srv.sqlErr = sql.Open("sqlite", ":memory:")
		if srv.sqlErr != nil {
			return
		}

		_, srv.sqlErr = srv.sqlDB.ExecContext(ctx, `
			CREATE TABLE tasks (
				id TEXT NOT NULL,
				queue_id TEXT NOT NULL,
				initiator_type TEXT NOT NULL,
				initiator_id TEXT NOT NULL,
				group_id TEXT NOT NULL,
				status TEXT NOT NULL,
				name TEXT NOT NULL,
				created_at TEXT NOT NULL,
				scheduled_at TEXT,
				deadline TEXT,
				timeout TEXT,
				max_attempts INTEGER
			)
		`)
		if srv.sqlErr != nil {
			return
		}

		_, srv.sqlErr = srv.sqlDB.ExecContext(ctx, `
			CREATE TABLE task_attempts (
				task_id TEXT NOT NULL,
				scheduled_at TEXT NOT NULL,
				leased_at TEXT NOT NULL,
				completed_at TEXT,
				failed_at TEXT,
				failed_reason TEXT
			)
		`)
		if srv.sqlErr != nil {
			return
		}
	})
	return srv.sqlDB, srv.sqlErr
}
