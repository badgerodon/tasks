#!/bin/bash
set -euo pipefail

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$_dir/../protos"

exec ../scripts/protoc \
    --go_out=paths=source_relative:../pkg/pb \
    --grpc-go_out=paths=source_relative:../pkg/pb \
    --ts_proto_out=../ui/src/pb \
    --ts_proto_opt=env=browser \
    --ts_proto_opt=outputClientImpl=grpc-web \
    ./*.proto
