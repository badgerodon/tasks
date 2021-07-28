package tasks

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	"github.com/badgerodon/pubsub"
	"github.com/rs/zerolog/log"
)

// A Handler is a function called for a task.
type Handler = func(payload []byte) error

// A Manager submits new tasks and handles existing ones.
type Manager struct {
	cfg          *config
	topic        pubsub.Topic
	subscription pubsub.Subscription

	mu       sync.RWMutex
	handlers map[string]Handler
}

// NewManager creates a new manager.
func NewManager(ctx context.Context, opts ...Option) (mgr *Manager, err error) {
	mgr = &Manager{cfg: getConfig(opts...)}

	mgr.topic, err = mgr.cfg.queue.Topic(ctx, mgr.cfg.topicName)
	if err != nil {
		return nil, fmt.Errorf("tasks: error creating pub/sub queue topic: %w", err)
	}

	mgr.subscription, err = mgr.topic.Subscribe(ctx, mgr.cfg.subscriptionName, mgr.cfg.subscribeOptions...)
	if err != nil {
		return nil, fmt.Errorf("tasks: error creating pub/sub queue subscription: %w", err)
	}

	mgr.handlers = make(map[string]Handler)

	return mgr, nil
}

// Run runs the manager. Received tasks will be run by handlers registered with `Handle`.
func (mgr *Manager) Run(ctx context.Context) error {
	logger := log.Ctx(ctx).With().
		Str("topic", mgr.cfg.topicName).
		Str("subscription", mgr.cfg.subscriptionName).
		Logger()
	ctx = logger.WithContext(ctx)

	log.Ctx(ctx).Info().
		Msg("tasks: running task manager")
	err := mgr.subscription.Receive(ctx, func(ctx context.Context, msg pubsub.SubscriberMessage) {
		var task Task
		err := json.Unmarshal(msg.Data(), &task)
		if err != nil {
			log.Ctx(ctx).Warn().
				Str("id", msg.ID()).
				Err(err).
				Msg("tasks: ignoring invalid task")
			msg.Ack()
			return
		}

		log.Ctx(ctx).Info().
			Str("id", msg.ID()).
			Str("type", task.Type).
			Err(err).
			Msg("tasks: task started")

		mgr.mu.RLock()
		handler, ok := mgr.handlers[task.Type]
		mgr.mu.RUnlock()

		if !ok {
			log.Ctx(ctx).Warn().
				Str("id", msg.ID()).
				Str("type", task.Type).
				Msg("tasks: ignoring unknown task type")
			msg.Ack()
			return
		}

		err = handler(task.Payload)
		if err != nil {
			log.Ctx(ctx).Error().
				Str("id", msg.ID()).
				Str("type", task.Type).
				Err(err).
				Msg("tasks: task failed")
			msg.Nack()
		} else {
			log.Ctx(ctx).Info().
				Str("id", msg.ID()).
				Str("type", task.Type).
				Err(err).
				Msg("tasks: task completed")
			msg.Ack()
		}
	})
	if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
		err = nil
	}
	return err
}

// Handle handles the given task type by calling the given callback function.
//
// If no error is returned, the message will be Ack'd, otherwise Nack'd.
func (mgr *Manager) Handle(taskType string, handler Handler) {
	mgr.mu.Lock()
	mgr.handlers[taskType] = handler
	mgr.mu.Unlock()
}

func (mgr *Manager) Submit(ctx context.Context, task *Task) error {
	bs, err := json.Marshal(task)
	if err != nil {
		return fmt.Errorf("tasks: error marshaling task: %w", err)
	}

	msg := pubsub.NewMessage(bs)
	err = mgr.topic.Publish(ctx, msg)
	if err != nil {
		return fmt.Errorf("tasks: error publishing task: %w", err)
	}

	log.Ctx(ctx).Info().
		Str("topic", mgr.cfg.topicName).
		Str("subscription", mgr.cfg.subscriptionName).
		Str("type", task.Type).
		Msg("tasks: submitted new task")

	return nil
}
