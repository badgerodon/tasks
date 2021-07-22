package memory

import (
	"context"
	"sync"
	"time"

	"github.com/badgerodon/tasks/internal/queue"
)

// A Queue sends messages in-memory via channels.
type Queue struct {
	ctx context.Context
	cfg *config

	ack     chan struct{}
	in, out chan *queueMessage
}

var _ queue.Queue = (*Queue)(nil)

// New creates a new queue.
func New(ctx context.Context, options ...Option) *Queue {
	q := &Queue{
		ctx: ctx,
		cfg: getConfig(options...),

		ack: make(chan struct{}),
		in:  make(chan *queueMessage),
		out: make(chan *queueMessage),
	}
	go q.run()
	return q
}

func (q *Queue) run() {
	var pushed []*queueMessage
	pending := 0

	for {
		if len(pushed) > 0 && pending < q.cfg.parallelism {
			select {
			case <-q.ctx.Done():
				return
			case msg := <-q.in:
				pushed = append(pushed, msg)
			case <-q.ack:
				pending--
			case q.out <- pushed[0]:
				pending++
				pushed = pushed[1:]
			}
		} else {
			select {
			case <-q.ctx.Done():
				return
			case msg := <-q.in:
				pushed = append(pushed, msg)
			case <-q.ack:
				pending--
			}
		}
	}
}

// Pull pulls a message from the queue.
func (q *Queue) Pull(ctx context.Context, handler queue.PullHandler, options ...queue.PullOption) error {
	cfg := queue.NewPullConfig(options...)
	for {
		select {
		case <-ctx.Done():
			return nil
		case msg := <-q.out:
			if msg.attempts > cfg.RetryPolicy.MaxAttempts {
				// drop the message as we've exceed the max attempts
				continue
			}
			// run the handler in a goroutine, possibly delaying based on the retry policy
			go func() {
				select {
				case <-ctx.Done():
					return
				case <-time.After(cfg.RetryPolicy.BackoffDuration(msg.attempts)):
					handler(ctx, msg)
				}
			}()
		}
	}
}

// Push pushes a message onto the queue.
func (q *Queue) Push(ctx context.Context, message queue.Message) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case q.in <- &queueMessage{
		Message:  message,
		queue:    q,
		attempts: 0,
	}:
	}
	return nil
}

type queueMessage struct {
	queue.Message
	queue    *Queue
	attempts int

	ackNackOnce sync.Once
}

func (msg *queueMessage) Ack() {
	msg.ackNackOnce.Do(func() {
		select {
		case <-msg.queue.ctx.Done():
		case msg.queue.ack <- struct{}{}:
		}
	})
}

func (msg *queueMessage) Nack() {
	msg.attempts++
	// push the message back onto the queue
	msg.ackNackOnce.Do(func() {
		select {
		case <-msg.queue.ctx.Done():
		case msg.queue.in <- msg:
		}
	})
}
