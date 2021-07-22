package pubsub

import (
	"context"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/badgerodon/tasks/internal/queue"
	"github.com/badgerodon/tasks/internal/testutil"
)

func TestQueue(t *testing.T) {
	ctx, clearTimeout := context.WithTimeout(context.Background(), time.Second*30)
	defer clearTimeout()

	assert.NoError(t, testutil.WithPubSubEmulator(ctx, func() {
		q, err := New(ctx, WithProjectID("PROJECT-1"))
		if !assert.NoError(t, err) {
			return
		}
		defer func() { _ = q.Close() }()

		msgs := []queue.Message{
			queue.NewMessage([]byte("1")),
			queue.NewMessage([]byte("2")),
			queue.NewMessage([]byte("3")),
			queue.NewMessage([]byte("4")),
		}

		for _, msg := range msgs {
			err = q.Push(ctx, msg)
			if !assert.NoError(t, err) {
				return
			}
		}

		pullCtx, pullCancel := context.WithCancel(ctx)
		defer pullCancel()

		expect := int64(len(msgs))
		var cnt int64
		err = q.Pull(pullCtx, func(ctx context.Context, msg queue.PullMessage) {
			msg.Ack()
			if atomic.AddInt64(&cnt, 1) == expect {
				pullCancel()
			}
		})
		assert.Equal(t, expect, cnt)
		assert.NoError(t, err)
	}))
}
