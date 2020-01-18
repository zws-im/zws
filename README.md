---
description: Shorten URLs with invisible spaces
---

# Zero Width Shortener

Zero Width Shortener \(abbreviated as ZWS\) is a URL shortener that shortens URLs using spaces that have zero width, making them invisible to humans.

### Characters

We've done a bit of research on what characters work on different platforms

| Character | In use | [Twitter](https://twitter.com/) | [iMessage](https://support.apple.com/explore/messages)\* | [Discord](https://discordapp.com/) | [Slack](https://slack.com) | [Telegram](https://telegram.org/) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `U+200B` | ✔️ | ❌ | ❌ | ✔️ | ❌ | ✔️ | Used in URLs since initial release, blacklisted space character on [Twitter](https://twitter.com/) |
| `U+200D` | ✔️ | ❌ |  | ✔️ |  | ✔️ | [Discord](https://discordapp.com/) prompts you with a "spoopy URL" popup when clicked |
| `U+200C` | ❌ | ❌ |  | ✔️ |  | ❌ | Blacklisted space on [Twitter](https://twitter.com/), discontinued \(previously used, replaced with `U+200D`\) |
| `U+180E` | ❌ | ❌ | ❌ | ✔️ |  | ❌ | Visible on iOS, discontinued in b39897e \(previously used, replaced with `U+200C`\) |
| `U+061C` | ❌ | ❌ |  | ✔️ |  | ✔️ |  |

* [iMessage](https://support.apple.com/explore/messages) note: Tested on latest beta of iOS


## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/zws-im/zws/graphs/contributors"><img src="https://opencollective.com/zws/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/zws/contribute)]

#### Individuals

<a href="https://opencollective.com/zws"><img src="https://opencollective.com/zws/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/zws/contribute)]

<a href="https://opencollective.com/zws/organization/0/website"><img src="https://opencollective.com/zws/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/1/website"><img src="https://opencollective.com/zws/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/2/website"><img src="https://opencollective.com/zws/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/3/website"><img src="https://opencollective.com/zws/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/4/website"><img src="https://opencollective.com/zws/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/5/website"><img src="https://opencollective.com/zws/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/6/website"><img src="https://opencollective.com/zws/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/7/website"><img src="https://opencollective.com/zws/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/8/website"><img src="https://opencollective.com/zws/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/zws/organization/9/website"><img src="https://opencollective.com/zws/organization/9/avatar.svg"></a>
