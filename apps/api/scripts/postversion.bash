#!/bin/bash
set -e

NEXT_VERSION=$(node -p 'process.env.npm_package_version')

# Login to Docker
echo $DOCKER_PASSWORD | docker login --username=$DOCKER_USERNAME --password-stdin

# Create Docker Buildx builder
docker buildx create --use

# Build and publish
# TODO: Re-enable ARM builds once Prisma binaries can be installed
# docker buildx build --pull --push --tag zwsim/zws:latest --tag zwsim/zws:$NEXT_VERSION --platform linux/amd64,linux/arm64 $PWD/../../
docker buildx build --pull --push --tag zwsim/zws:latest --tag zwsim/zws:$NEXT_VERSION --platform linux/amd64 $PWD/../../
