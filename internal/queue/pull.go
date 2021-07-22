package queue

import (
	"context"
	"time"
)

// A PullConfig
type PullConfig struct {
	RetryPolicy RetryPolicy
}

// A PullOption customizes the pull config.
type PullOption = func(cfg *PullConfig)

// WithMaxAttempts sets the max attempts in the pull config.
func WithMaxAttempts(maxAttempts int) PullOption {
	return func(cfg *PullConfig) {
		cfg.RetryPolicy.MaxAttempts = maxAttempts
	}
}

// WithMinBackoff sets the min backoff in the pull config.
func WithMinBackoff(minBackoff time.Duration) PullOption {
	return func(cfg *PullConfig) {
		cfg.RetryPolicy.MinBackoff = minBackoff
	}
}

// WithMaxBackoff sets the max backoff in the pull config.
func WithMaxBackoff(maxBackoff time.Duration) PullOption {
	return func(cfg *PullConfig) {
		cfg.RetryPolicy.MaxBackoff = maxBackoff
	}
}

// NewPullConfig creates a new PullConfig from the given options.
func NewPullConfig(options ...PullOption) *PullConfig {
	cfg := new(PullConfig)
	WithMaxAttempts(5)(cfg)
	WithMinBackoff(time.Second * 10)(cfg)
	WithMaxBackoff(time.Second * 600)(cfg)
	for _, option := range options {
		option(cfg)
	}
	return cfg
}

// A PullHandler is a function which is invoked any time a new message is received.
type PullHandler = func(ctx context.Context, message PullMessage)
