package server

import (
	"github.com/badgerodon/tasks/internal/database/memory"
	"github.com/badgerodon/tasks/pkg/pb"
)

type config struct {
	database pb.TasksServer
	bindAddr string
}

// An Option modifies the config.
type Option func(*config)

func newConfig(options ...Option) *config {
	cfg := new(config)
	WithBindAddr(":8080")(cfg)
	WithDatabase(memory.New())(cfg) // default to the in-memory database
	for _, o := range options {
		o(cfg)
	}
	return cfg
}

// WithBindAddr sets the bind address in the config.
func WithBindAddr(addr string) Option {
	return func(cfg *config) {
		cfg.bindAddr = addr
	}
}

// WithDatabase sets the database in the options.
func WithDatabase(db pb.TasksServer) Option {
	return func(cfg *config) {
		cfg.database = db
	}
}
