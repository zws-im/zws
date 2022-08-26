# Zero Width Shortener (ZWS)

[![Number of shortened URLs][stats-urls-image]](#Badges)
[![Number of visited URLs][stats-visits-image]](#Badges)
[![ZWS version][stats-version-image]](#Badges)

Shorten URLs with invisible spaces.

[Try it out online: zws.im](https://zws.im) (or with our [CLI](https://github.com/zws-im/cli#readme)).

You could also [host your own private instance](#Self-hosting) and use any characters you'd like (a-z, emoji, etc).

## Contributors

### Code Contributors

ZWS is maintained by [Jonah Snider](https://github.com/jonahsnider) but contributions to the codebase are more than welcome!

Special thanks to [Jaex](https://github.com/Jaex) for integrating ZWS into [ShareX](https://getsharex.com/).

### Financial Contributors

[Help support this project as a financial contributor][open-collective].

#### Individuals

[![Individual contributors](https://opencollective.com/zws/individuals.svg?width=890)](https://opencollective.com/zws)

#### Organizations

[Support this project with your organization][open-collective]. Your logo will show up here with a link to your website.

[![Organization avatar](https://opencollective.com/zws/organization/0/avatar.svg)](https://opencollective.com/zws/organization/0/website)
[![Organization avatar](https://opencollective.com/zws/organization/1/avatar.svg)](https://opencollective.com/zws/organization/1/website)
[![Organization avatar](https://opencollective.com/zws/organization/2/avatar.svg)](https://opencollective.com/zws/organization/2/website)
[![Organization avatar](https://opencollective.com/zws/organization/3/avatar.svg)](https://opencollective.com/zws/organization/3/website)
[![Organization avatar](https://opencollective.com/zws/organization/4/avatar.svg)](https://opencollective.com/zws/organization/4/website)
[![Organization avatar](https://opencollective.com/zws/organization/5/avatar.svg)](https://opencollective.com/zws/organization/5/website)
[![Organization avatar](https://opencollective.com/zws/organization/6/avatar.svg)](https://opencollective.com/zws/organization/6/website)
[![Organization avatar](https://opencollective.com/zws/organization/7/avatar.svg)](https://opencollective.com/zws/organization/7/website)
[![Organization avatar](https://opencollective.com/zws/organization/8/avatar.svg)](https://opencollective.com/zws/organization/8/website)
[![Organization avatar](https://opencollective.com/zws/organization/9/avatar.svg)](https://opencollective.com/zws/organization/9/website)

## [Status page][status-page]

A status page for the official zws.im instance of ZWS is available at **[status.zws.im][status-page]**.

## Self-hosting

### Heroku

[![Deploy to Heroku][deploy-to-heroku-image]][deploy-to-heroku]

Running an instance of ZWS on Heroku is an easy way to self-host thanks to our `app.json` & `Procfile`.

### DigitalOcean

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/zws-im/zws/tree/main)

We provide a template app specification YAML file to allow users to launch an instance on the DigitalOcean App Platform.

### [Docker Compose][docker-compose]

1. [Clone the repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
2. Copy [`db.example.env`](db.example.env) to `db.env` and fill in the values
3. Copy [`example.env`](example.env) to `.env` and update the `DATABASE_URL` environment variable to match the values in `db.env`
4. Remember to change the hostname of the database container to `db` - trying to use `localhost` will not work
5. Run [`docker-compose up -d`](https://docs.docker.com/compose/reference/up/) (this will automatically apply database migrations)

### Database migrations

Database migrations are automatically applied on Heroku and Docker Compose.
You can easily run database migrations manually through [Docker Compose][docker-compose] by running the following command:

```sh
docker-compose up migration
```

Make sure the `DATABASE_URL` environment variable in `.env` is accurate.

#### [Heroku Postgres][heroku-postgres]

If you are hosting your instance on Heroku, migrations are automatically applied.
If you need to manually apply migrations or are only using Heroku for your database you'll need the credentials for your database:

1. Get the [Heroku Postgres][heroku-postgres] connection URI from
   - [the web interface](https://data.heroku.com/) (select your datastore, "Settings", "Database Credentials", "URI")
   - [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-postgresql#external-connections-ingress)
2. Create a `.env` file and enter in the connection URI

Example:

```env
DATABASE_URL=postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
```

Afterward you can run the migration commands shown above.

## Badges

ZWS instances expose a few routes that implement the [Shields endpoint schema](https://shields.io/endpoint):

| Image                                         | Route                    | Description              | Example                                                                                               |
| --------------------------------------------- | ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| ![Number of shortened URLs][stats-urls-image] | `/stats/shields/urls`    | Number of shortened URLs | [`https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/urls`][stats-urls-image]       |
| ![Number of visited URLs][stats-visits-image] | `/stats/shields/visits`  | Number of visited URLs   | [`https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/visits`][stats-visits-image]   |
| ![ZWS version][stats-version-image]           | `/stats/shields/version` | ZWS version              | [`https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/version`][stats-version-image] |

[deploy-to-heroku]: https://dashboard.heroku.com/new?template=https://github.com/zws-im/zws
[deploy-to-heroku-image]: https://www.herokucdn.com/deploy/button.svg
[heroku-postgres]: https://www.heroku.com/postgres
[docker-compose]: https://docs.docker.com/compose/
[open-collective]: https://opencollective.com/zws/contribute
[stats-urls-image]: https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/urls
[stats-visits-image]: https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/visits
[stats-version-image]: https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/version
[status-page]: https://status.zws.im/
