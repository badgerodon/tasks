package sql

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"

	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type NullInt32 struct {
	ptr *int32
}

func (ni *NullInt32) Scan(value interface{}) error {
	tmp := sql.NullInt32{}
	err := tmp.Scan(value)
	if err != nil {
		return err
	}

	if !tmp.Valid {
		ni.ptr = nil
		return nil
	}

	ni.ptr = &tmp.Int32
	return nil
}

// Value implements the Valuer interface.
func (ni NullInt32) Value() (driver.Value, error) {
	if ni.ptr == nil {
		return nil, nil
	}
	return *ni.ptr, nil
}

type NullDuration struct {
	ptr *durationpb.Duration
}

// Scan implements the Scanner interface.
func (nd *NullDuration) Scan(value interface{}) error {
	tmp := sql.NullString{}
	err := tmp.Scan(value)
	if err != nil {
		return err
	}

	if !tmp.Valid {
		nd.ptr = nil
		return nil
	}

	dur, err := time.ParseDuration(tmp.String)
	if err != nil {
		return fmt.Errorf("invalid NullDuration: %w", err)
	}
	nd.ptr = durationpb.New(dur)

	return nil
}

// Value implements the Valuer interface.
func (nd NullDuration) Value() (driver.Value, error) {
	if nd.ptr == nil {
		return nil, nil
	}

	return nd.ptr.AsDuration().String(), nil
}

type NullTimestamp struct {
	ptr *timestamppb.Timestamp
}

// Scan implements the Scanner interface.
func (nt *NullTimestamp) Scan(value interface{}) error {
	tmp := sql.NullString{}
	err := tmp.Scan(value)
	if err != nil {
		return err
	}

	if !tmp.Valid {
		nt.ptr = nil
		return nil
	}
	if value == nil {
		nt.ptr = nil
		return nil
	}

	tm, err := time.Parse(time.RFC3339Nano, tmp.String)
	if err != nil {
		return fmt.Errorf("invalid NullTimestamp: %w", err)
	}
	nt.ptr = timestamppb.New(tm)

	return nil
}

// Value implements the Valuer interface.
func (nt NullTimestamp) Value() (driver.Value, error) {
	if nt.ptr == nil {
		return nil, nil
	}

	return nt.ptr.AsTime().Format(time.RFC3339Nano), nil
}
