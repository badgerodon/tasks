package tasks

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/badgerodon/tasks/internal/ids"
	"github.com/badgerodon/tasks/internal/queue"
)

// A Task is a single unit of work.
type Task struct {
	Type    string `json:"type"`
	ID      string `json:"id"`
	Payload []byte `json:"payload"`
}

// Submit submits a task to the given message queue.
//
// If the task does not have an ID one will be generated.
func Submit(ctx context.Context, q queue.Queue, task *Task) error {
	if task.ID == "" {
		task.ID = ids.New()
	}
	bs, err := json.Marshal(task)
	if err != nil {
		return fmt.Errorf("tasks: error marshaling task: %w", err)
	}
	return q.Push(ctx, queue.NewMessage(bs))
}
