package ids

import (
	"crypto/rand"

	"github.com/oklog/ulid/v2"
)

var entropy = ulid.Monotonic(rand.Reader, 0)

// New creates a new, random, sequential id.
func New() string {
	return ulid.MustNew(ulid.Now(), entropy).String()
}
