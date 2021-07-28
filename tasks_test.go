package tasks

import (
	"context"
	"fmt"
	"sync/atomic"
	"testing"
	"time"

	"github.com/badgerodon/pubsub"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

func TestManager(t *testing.T) {
	ctx, cancel := getTestContext()
	defer cancel()

	mgr, err := NewManager(ctx, WithSubscribeOptions(pubsub.WithMinBackoff(time.Millisecond*10)))
	if !assert.NoError(t, err) {
		return
	}

	var cnt1, cnt2 int64

	mgr.Handle("EXAMPLE-1", func(payload []byte) error {
		if atomic.AddInt64(&cnt1, 1) == 1 {
			return fmt.Errorf("TEST FAIL")
		}
		return nil
	})

	mgr.Handle("EXAMPLE-2", func(payload []byte) error {
		atomic.AddInt64(&cnt2, 1)
		return nil
	})

	go func() {
		assert.NoError(t, mgr.Run(ctx))
	}()

	// submit a bad task to make sure the library ignores it
	_ = mgr.topic.Publish(ctx, pubsub.NewMessage([]byte("BAD MESSAGE")))

	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-1"}))
	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-1"}))
	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-2"}))
	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-1"}))
	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-2"}))
	assert.NoError(t, mgr.Submit(ctx, &Task{Type: "EXAMPLE-3"}))

	assert.Eventually(t, func() bool {
		return atomic.LoadInt64(&cnt1) == 4
	}, time.Second*10, time.Millisecond*100)
	assert.Eventually(t, func() bool {
		return atomic.LoadInt64(&cnt2) == 2
	}, time.Second*10, time.Millisecond*100)
}

func getTestContext() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithCancel(context.Background())

	out := zerolog.NewConsoleWriter()
	out.PartsExclude = []string{zerolog.TimestampFieldName}
	out.NoColor = true
	logger := zerolog.New(out)
	ctx = logger.WithContext(ctx)

	return ctx, cancel
}
