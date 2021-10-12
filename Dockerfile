FROM node:16.10.0-alpine3.13

WORKDIR /usr/src/app

ENV PORT=3000
EXPOSE 3000

# hadolint ignore=DL3018
RUN apk add --no-cache \
	#  Needed for healthchecks
	curl \
	# Needed to use Google Cloud Profiler
	ca-certificates \
	# Needed to use compile Prisma on arm64
	openssl libc6-compat \
	# Needed to compile pprof
	python3 make g++

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -X GET --fail http://localhost:3000/health || exit 0

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY prisma ./prisma
COPY .yarn ./.yarn

# hadolint ignore=DL3060
RUN yarn install --immutable \
	&& yarn prisma generate

COPY src ./src
COPY types ./types

RUN yarn build

# Remove devDependencies manually, Yarn 2 doesn't support skipping them (see https://yarnpkg.com/configuration/manifest#devDependencies)
RUN yarn remove @jonahsnider/prettier-config @jonahsnider/xo-config @semantic-release/exec @tsconfig/node16 @types/node prettier semantic-release ts-node type-fest typescript xo \
	&& yarn install --immutable \
	&& yarn cache clean \
	&& rm -rf src types tsconfig.json

# Remove these since they are only needed to compile dependencies
RUN apk del openssl libc6-compat python3 make g++

CMD ["node", "."]
