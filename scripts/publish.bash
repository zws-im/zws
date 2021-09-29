#!/bin/bash
set -e

NEXT_VERSION=$1

# Build and publish
# TODO: Re-enable ARM builds once Prisma binaries can be installed
# docker buildx build --pull --push --tag zwsim/zws:latest --tag zwsim/zws:$NEXT_VERSION --platform linux/amd64,linux/arm64,linux/arm/v7 .
docker buildx build --pull --push --tag zwsim/zws:latest --tag zwsim/zws:$NEXT_VERSION --platform linux/amd64 .
