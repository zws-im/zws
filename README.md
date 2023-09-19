# Zero Width Shortener (ZWS) [<img src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" align="right" />](https://vercel.com/?utm_source=jonah-snider&utm_campaign=oss)

[![Number of shortened URLs][stats-urls-image]](#Badges)
[![Number of visited URLs][stats-visits-image]](#Badges)

Shorten URLs with invisible spaces.

[Try it out online: zws.im](https://zws.im) (or with our [CLI](https://github.com/zws-im/cli#readme)).

## API Documentation

An OpenAPI schema and API documentation is available here: [zws.im/api-docs](https://zws.im/api-docs).

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

## Badges

ZWS instances expose a few routes that implement the [Shields endpoint schema](https://shields.io/endpoint):

| Image                                         | Route                   | Description              | Example                                                                                             |
| --------------------------------------------- | ----------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| ![Number of shortened URLs][stats-urls-image] | `/stats/shields/urls`   | Number of shortened URLs | [`https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/urls`][stats-urls-image]     |
| ![Number of visited URLs][stats-visits-image] | `/stats/shields/visits` | Number of visited URLs   | [`https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/visits`][stats-visits-image] |

[open-collective]: https://opencollective.com/zws/contribute
[stats-urls-image]: https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/urls
[stats-visits-image]: https://img.shields.io/endpoint?url=https://api.zws.im/stats/shields/visits
