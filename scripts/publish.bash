#!/bin/bash
set -e

NEXT_VERSION=$1

# Build and publish
docker buildx build --pull --push --tag zwsim/zws:latest --tag zwsim/zws:$NEXT_VERSION --platform linux/amd64,linux/arm64,linux/arm/v7 .
