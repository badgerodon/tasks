package tasks

import (
	"context"
	"encoding/json"
	"sync"

	"github.com/rs/zerolog/log"

	"github.com/badgerodon/tasks/internal/queue"
)

// A WorkerHandler handles a task.
type WorkerHandler func(ctx context.Context, task *Task) error

// A WorkerPool pulls tasks from the queue and runs them with registered handlers.
type WorkerPool struct {
	queue       queue.Queue
	pullOptions []queue.PullOption

	mu       sync.RWMutex
	handlers map[string]WorkerHandler
}

// NewWorkerPool creates a new WorkerPool.
func NewWorkerPool(q queue.Queue, pullOptions ...queue.PullOption) *WorkerPool {
	return &WorkerPool{
		queue:    q,
		handlers: make(map[string]WorkerHandler),
	}
}

// Handle registers a worker handler for the given task type.
func (pool *WorkerPool) Handle(taskType string, handler WorkerHandler) {
	pool.mu.Lock()
	pool.handlers[taskType] = handler
	pool.mu.Unlock()
}

// Run runs the WorkerPool.
func (pool *WorkerPool) Run(ctx context.Context) error {
	return pool.queue.Pull(ctx, func(ctx context.Context, message queue.PullMessage) {
		var task Task
		err := json.Unmarshal(message.Data(), &task)
		if err != nil {
			log.Error().Err(err).Msg("tasks: invalid task")
			message.Nack()
			return
		}

		pool.mu.RLock()
		handler, ok := pool.handlers[task.Type]
		pool.mu.RUnlock()
		if !ok {
			log.Error().Interface("task", task).Msg("tasks: unknown task type")
			message.Nack()
			return
		}

		err = handler(ctx, &task)
		if err != nil {
			log.Error().Err(err).Msg("tasks: error running task")
			message.Nack()
		} else {
			message.Ack()
		}
	}, pool.pullOptions...)
}
