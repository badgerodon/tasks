package sql

type config struct {
	rawURL string
}

type Option func(*config)

func newConfig(options ...Option) *config {
	cfg := new(config)
	WithURL("moderncsqlite://:memory:")
	for _, o := range options {
		o(cfg)
	}
	return cfg
}

// WithURL sets the raw database url in the config.
func WithURL(rawURL string) Option {
	return func(cfg *config) {
		cfg.rawURL = rawURL
	}
}
