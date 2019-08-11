---
description: Shorten URLs with invisible spaces
---

# Zero Width Shortener

Zero Width Shortener \(abbreviated as ZWS\) is a URL shortener that shortens URLs using spaces that have zero width, making them invisible to humans.

## Characters

We've done a bit of research on what characters work on different platforms

| Character | In use | [Twitter](https://twitter.com/) | [iMessage](https://support.apple.com/explore/messages)\* | [Discord](https://discordapp.com/) | [Slack](https://slack.com) | [Telegram](https://telegram.org/) | Notes                                                                                                        |
| --------- | ------ | ------------------------------- | -------------------------------------------------------- | ---------------------------------- | -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `U+200B`  | ✔️     | ❌                              | ❌                                                       | ✔️                                 | ❌                         | ✔️                                | Used in URLs since initial release, blacklisted space character on [Twitter](https://twitter.com/)           |
| `U+200D`  | ✔️     | ❌                              |                                                          | ✔️                                 |                            | ✔️                                | [Discord](https://discordapp.com/) prompts you with a "spoopy URL" popup when clicked                        |
| `U+200C`  | ❌     | ❌                              |                                                          | ✔️                                 |                            | ❌                                | Blacklisted space on [Twitter](https://twitter.com/), discontinued (previously used, replaced with `U+200D`) |
| `U+180E`  | ❌     | ❌                              | ❌                                                       | ✔️                                 |                            | ❌                                | Visible on iOS, discontinued in b39897e (previously used, replaced with `U+200C`)                            |
| `U+061C`  | ❌     | ❌                              |                                                          | ✔️                                 |                            | ✔️                                |                                                                                                              |

- [iMessage](https://support.apple.com/explore/messages) note: Tested on latest beta of iOS
