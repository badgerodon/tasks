package tasks

// A Task is a single unit of work.
type Task struct {
	Type    string `json:"type"`
	Payload []byte `json:"payload"`
}
