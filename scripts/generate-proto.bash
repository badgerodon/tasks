#!/bin/bash
set -euo pipefail

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$_dir/../protos"

exec ../scripts/protoc \
    --go_out=paths=source_relative:../pkg/pb \
    --twirp_out=paths=source_relative:../pkg/pb \
    --ts_out=../ui/src/pb \
    --ts_opt=client_none \
    --ts_opt=generate_dependencies \
    --twirp_ts_out=../ui/src/pb \
    ./*.proto
