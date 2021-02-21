FROM node:15.9.0-alpine3.10

WORKDIR /usr/src/app

ENV PORT=3000
EXPOSE 3000

COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY prisma ./prisma
COPY .yarn ./.yarn
COPY src ./src

RUN yarn install --immutable
RUN yarn prisma generate
RUN yarn build

RUN rm -rf .yarn/cache src

CMD ["node", "."]
