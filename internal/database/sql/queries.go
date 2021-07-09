package sql

import (
	"context"
	"database/sql"
)

func getTask(
	ctx context.Context,
	tx *sql.Tx,
	id string,

	// out
	queueID *string,
	initiatorType *string,
	initiatorID *string,
	groupID *string,
	status *string,
	name *string,
	createdAt *NullTimestamp,
	scheduledAt *NullTimestamp,
	deadline *NullTimestamp,
	timeout *NullDuration,
	maxAttempts *NullInt32,
) error {
	err := tx.QueryRowContext(ctx, `
		SELECT queue_id, initiator_type, initiator_id, group_id, status, name, created_at, scheduled_at, deadline, timeout, max_attempts
		FROM tasks
		WHERE id = $1
	`, id).Scan(queueID, initiatorType, initiatorID, groupID, status, name, createdAt, scheduledAt, deadline, timeout, maxAttempts)
	return err
}

func insertTask(
	ctx context.Context,
	tx *sql.Tx,
	id string,
	queueID string,
	initiatorType string,
	initiatorID string,
	groupID string,
	status string,
	name string,
	createdAt NullTimestamp,
	scheduledAt NullTimestamp,
	deadline NullTimestamp,
	timeout NullDuration,
	maxAttempts NullInt32,
) error {
	_, err := tx.ExecContext(ctx, `
		INSERT INTO tasks (id, queue_id, initiator_type, initiator_id, group_id, status, name, created_at, scheduled_at, deadline, timeout, max_attempts)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`, id, queueID, initiatorType, initiatorID, groupID, status, name, createdAt, scheduledAt, deadline, timeout, maxAttempts)
	return err
}
