package database

import (
	"context"
	"testing"
	"time"

	"github.com/badgerodon/tasks/internal/database/sql"
	"github.com/badgerodon/tasks/pkg/pb"
	"github.com/stretchr/testify/assert"
)

func TestSQLite(t *testing.T) {
	ctx, clearTimeout := context.WithTimeout(context.Background(), time.Second*30)
	defer clearTimeout()

	db := sql.New(sql.WithURL("moderncsqlite://:memory:"))
	runTestSuite(ctx, t, db)
}

func runTestSuite(ctx context.Context, t *testing.T, db pb.TasksServer) {
	t.Run("submit", func(t *testing.T) {
		t.Run("simple", func(t *testing.T) {
			res, err := db.SubmitTask(ctx, &pb.SubmitTaskRequest{
				Task: &pb.Task{
					QueueId:       "QUEUE1",
					InitiatorType: pb.Task_SCHEDULED_TASK,
					InitiatorId:   "SCHEDULEDTASK1",
					GroupId:       "GROUP1",
					Status:        pb.Task_COMPLETED,
					Name:          "TASK1",
				},
			})
			if assert.NoError(t, err) && assert.NotNil(t, res) && assert.NotNil(t, res.Task) {
				assert.NotEmpty(t, res.GetTask().GetId())
				assert.Equal(t, "QUEUE1", res.GetTask().GetQueueId())
				assert.Equal(t, pb.Task_SCHEDULED_TASK, res.GetTask().GetInitiatorType())
				assert.Equal(t, "SCHEDULEDTASK1", res.GetTask().GetInitiatorId())
				assert.Equal(t, "TASK1", res.GetTask().GetName())
			}
		})
		t.Run("require name", func(t *testing.T) {
			res, err := db.SubmitTask(ctx, &pb.SubmitTaskRequest{
				Task: &pb.Task{QueueId: "QUEUE1"},
			})
			assert.Nil(t, res)
			if assert.Error(t, err) {
				assert.Contains(t, err.Error(), "task name is required")
			}
		})
		t.Run("require queue_id", func(t *testing.T) {
			res, err := db.SubmitTask(ctx, &pb.SubmitTaskRequest{
				Task: &pb.Task{Name: "TASK1"},
			})
			assert.Nil(t, res)
			if assert.Error(t, err) {
				assert.Contains(t, err.Error(), "task queue_id is required")
			}
		})
		t.Run("defaults", func(t *testing.T) {
		})
	})
}
