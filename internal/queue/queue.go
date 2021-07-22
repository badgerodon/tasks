package queue

import (
	"context"
)

// A Queue implements a push/pull message queue.
type Queue interface {
	// Pull pulls any pending messages from the queue.
	Pull(ctx context.Context, handler PullHandler, options ...PullOption) error
	// Push pushes a new message to the queue.
	Push(ctx context.Context, message Message) error
}
