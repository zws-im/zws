FROM node:16.13.0-alpine3.13

WORKDIR /usr/src/app

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -X GET --fail http://localhost:3000/health || exit 1

# hadolint ignore=DL3018
RUN apk add --no-cache \
	# Needed for healthchecks
	curl \
	# Needed to use Google Cloud Profiler
	ca-certificates \
	# Needed to use compile Prisma on arm64
	openssl libc6-compat \
	# Needed to compile pprof
	python3 make g++

# Install all dependencies
COPY prisma ./prisma
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY packages ./packages

# hadolint ignore=DL3060
RUN yarn install --immutable \
	&& yarn prisma generate \
	# Remove these since they are only needed to compile dependencies
	&& apk del openssl libc6-compat python3 make g++

# Compile
RUN yarn build \
	# Delete source files
	&& yarn clean \
	# Remove dev dependencies
	&& yarn workspaces focus --all --production \
	# Clean cache
	&& yarn cache clean

CMD ["yarn", "start"]
