package tasks

import (
	"context"

	"github.com/badgerodon/pubsub"
	"github.com/badgerodon/pubsub/providers/memory"
)

var (
	DefaultSubscriptionName = "badgerodon-tasks-worker"
	DefaultTopicName        = "badgerodon-tasks"
)

type config struct {
	queue            pubsub.Queue
	topicName        string
	subscriptionName string
	subscribeOptions []pubsub.SubscribeOption
}

type Option func(*config)

// WithQueue sets the pub/sub queue.
func WithQueue(queue pubsub.Queue) Option {
	return func(cfg *config) {
		cfg.queue = queue
	}
}

// WithQueueSubscription sets the queue subscription name.
func WithQueueSubscription(subscriptionName string) Option {
	return func(cfg *config) {
		cfg.subscriptionName = subscriptionName
	}
}

// WithQueueTopic sets the queue topic name.
func WithQueueTopic(topicName string) Option {
	return func(cfg *config) {
		cfg.topicName = topicName
	}
}

// WithSubscribeOptions sets the subscribe options.
func WithSubscribeOptions(opts ...pubsub.SubscribeOption) Option {
	return func(cfg *config) {
		cfg.subscribeOptions = opts
	}
}

func getConfig(opts ...Option) *config {
	cfg := new(config)
	WithQueue(memory.New(context.Background()))(cfg)
	WithQueueSubscription(DefaultSubscriptionName)(cfg)
	WithQueueTopic(DefaultTopicName)(cfg)
	for _, opt := range opts {
		opt(cfg)
	}
	return cfg
}
