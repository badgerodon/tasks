package main

import (
	"context"
	"fmt"
	"os"

	"github.com/badgerodon/tasks/internal/server"
)

func main() {
	srv := server.New()
	err := srv.Run(context.Background())
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s", err.Error())
		os.Exit(1)
	}
}
