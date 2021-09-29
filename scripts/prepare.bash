#!/bin/bash

NEXT_VERSION=$1

# Update package.json
npm version --git-tag-version=false $NEXT_VERSION

# Login to Docker
echo $DOCKER_PASSWORD | docker login --username=$DOCKER_USERNAME --password-stdin

# Create Docker Buildx builder
docker buildx create --use
