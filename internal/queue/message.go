package queue

import "github.com/badgerodon/tasks/internal/ids"

// A Message is a message in the queue.
type Message interface {
	// ID is the message ID.
	ID() string
	// Data is the message Data.
	Data() []byte
}

// A PullMessage is a message with ack/nack methods.
type PullMessage interface {
	Message
	// Ack acknowledges completion of processing the message.
	Ack()
	// Nack re-enqueues the message.
	Nack()
}

type simpleMessage struct {
	id   string
	data []byte
}

func (msg simpleMessage) ID() string {
	return msg.id
}

func (msg simpleMessage) Data() []byte {
	return msg.data
}

// NewMessage creates a new message with a generated id.
func NewMessage(data []byte) Message {
	return simpleMessage{
		id:   ids.New(),
		data: data,
	}
}
