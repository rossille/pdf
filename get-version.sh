#!/usr/bin/env bash

set -euo pipefail

last_commit_sha=$(git rev-parse --short=10 HEAD)
last_commit_timestamp=$(git show -s --format=%ct "$last_commit_sha")

date_timestamp_flags=()
case "$(uname -s)" in
    Linux*)  date_timestamp_flags=(-d @"$last_commit_timestamp");;
    Darwin*) date_timestamp_flags=(-r "$last_commit_timestamp");;
    *)       echo "Only Linux and macOS are supported"; exit 1;;
esac

formatted_version=$(TZ=Europe/Paris date "${date_timestamp_flags[@]}" +"%y.%m.%d-ts%s+git$last_commit_sha")

echo -n "$formatted_version"
