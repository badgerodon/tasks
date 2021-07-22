// Package pubsub implements a queue using google cloud pubsub.
package pubsub

import (
	"context"
	"fmt"

	"cloud.google.com/go/pubsub"

	"github.com/badgerodon/tasks/internal/queue"
)

// Queue implements the queue interface via google cloud pubsub.
type Queue struct {
	cfg          *config
	client       *pubsub.Client
	topic        *pubsub.Topic
	subscription *pubsub.Subscription
}

var _ queue.Queue = (*Queue)(nil)

// New creates a new queue.
func New(ctx context.Context, options ...Option) (*Queue, error) {
	q := &Queue{cfg: getConfig(options...)}

	var err error
	q.client, err = pubsub.NewClient(ctx, q.cfg.projectID)
	if err != nil {
		return nil, err
	}

	q.topic = q.client.Topic(q.cfg.topicID)
	exists, err := q.topic.Exists(ctx)
	if err != nil {
		_ = q.client.Close()
		return nil, err
	} else if !exists {
		q.topic, err = q.client.CreateTopic(ctx, q.cfg.topicID)
		if err != nil {
			_ = q.client.Close()
			return nil, err
		}
	}

	q.subscription = q.client.Subscription(q.cfg.subscriptionID)
	exists, err = q.subscription.Exists(ctx)
	if err != nil {
		return nil, err
	}
	if !exists {
		q.subscription, err = q.client.CreateSubscription(ctx, q.cfg.subscriptionID,
			pubsub.SubscriptionConfig{
				Topic: q.topic,
			})
		if err != nil {
			return nil, err
		}
	}

	return q, nil
}

// Close closes the queue.
func (q *Queue) Close() error {
	return q.client.Close()
}

// Pull pulls messages from the queue.
func (q *Queue) Pull(ctx context.Context, handler queue.PullHandler, options ...queue.PullOption) error {
	// update the subscription with the new options
	cfg := queue.NewPullConfig(options...)
	_, err := q.subscription.Update(ctx, pubsub.SubscriptionConfigToUpdate{
		RetryPolicy: &pubsub.RetryPolicy{
			MinimumBackoff: cfg.RetryPolicy.MinBackoff,
			MaximumBackoff: cfg.RetryPolicy.MaxBackoff,
		},
		DeadLetterPolicy: &pubsub.DeadLetterPolicy{
			MaxDeliveryAttempts: cfg.RetryPolicy.MaxAttempts,
		},
	})
	if err != nil {
		return fmt.Errorf("pubsub: error updating subscription configuration: %w", err)
	}

	// start receiving messages
	return q.subscription.Receive(ctx, func(ctx context.Context, msg *pubsub.Message) {
		handler(ctx, pullMessage{underlying: msg})
	})
}

// Push pushes messages to the queue.
func (q *Queue) Push(ctx context.Context, msg queue.Message) error {
	_, err := q.topic.Publish(ctx, &pubsub.Message{
		ID:   msg.ID(),
		Data: msg.Data(),
	}).Get(ctx)
	return err
}

type pullMessage struct {
	underlying *pubsub.Message
}

func (msg pullMessage) ID() string {
	return msg.underlying.ID
}

func (msg pullMessage) Data() []byte {
	return msg.underlying.Data
}

func (msg pullMessage) Ack() {
	msg.underlying.Ack()
}

func (msg pullMessage) Nack() {
	msg.underlying.Nack()
}
