#!/usr/bin/env bash
set -euo pipefail

# Update RN/React versions before install when REACT_NATIVE_VERSION is provided
node ./scripts/changeReactNativeVersion.js || true

# Install dependencies (base step for all CI jobs)
npm install


