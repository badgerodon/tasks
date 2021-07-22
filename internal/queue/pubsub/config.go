package pubsub

import "os"

type config struct {
	projectID      string
	subscriptionID string
	topicID        string
}

type Option = func(cfg *config)

func getConfig(options ...Option) *config {
	cfg := new(config)
	WithProjectID(os.Getenv("PUBSUB_PROJECT_ID"))(cfg)
	WithSubscriptionID("badgerodon-tasks-worker")(cfg)
	WithTopicID("badgerodon-tasks")(cfg)
	for _, option := range options {
		option(cfg)
	}
	return cfg
}

func WithProjectID(projectID string) Option {
	return func(cfg *config) {
		cfg.projectID = projectID
	}
}

func WithSubscriptionID(subscriptionID string) Option {
	return func(cfg *config) {
		cfg.subscriptionID = subscriptionID
	}
}

func WithTopicID(topicID string) Option {
	return func(cfg *config) {
		cfg.topicID = topicID
	}
}
