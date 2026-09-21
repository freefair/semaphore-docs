# Notifications

Semaphore reports task results to chat and e-mail. A channel is configured once on
the server, in `config.json` or through environment variables, and then applies to
every project. Which tasks produce an alert is decided per project and per template
in the web interface.

<a id="how-delivery-works"></a>

## How delivery works

Three settings decide whether a message is sent, and all three must allow it:

1. **The channel is configured on the server.** Each provider has its own keys in
   `config.json`. See the page for that provider below.
2. **The project allows alerts.** *Allow alerts for this project* in
   [project settings](../user-guide/projects/settings.md) is the master switch. With it
   off, no channel sends anything about that project.
3. **The template asks for it.** A task template chooses whether to alert on
   success, on error, or not at all, see [Task Templates](../user-guide/task-templates/README.md).

Use **Test alerts** in project settings to send a test message through every
configured channel without running a task.

<a id="channels"></a>

## Channels

| Channel | Page |
|---|---|
| E-mail (SMTP) | [Email](notifications/email.md) |
| Telegram | [Telegram](notifications/telegram.md) |
| Slack | [Slack](notifications/slack.md) |
| Microsoft Teams | [Teams](notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](notifications/rocket.md) |
| DingTalk | [DingTalk](notifications/ding.md) |
| Gotify | [Gotify](notifications/gotify.md) |

Several channels can be enabled at the same time; each one receives every alert
that passes the three checks above.

<a id="per-project-overrides"></a>

## Per-project overrides

Telegram supports a per-project chat: set **Telegram Chat ID** in
[project settings](../user-guide/projects/settings.md) to route one project's alerts to
a different chat than the server-wide one. Other channels use the server
configuration for all projects.

<a id="where-to-start"></a>

## Where to start

Configure one channel first, turn on *Allow alerts for this project*, and press
**Test alerts**. Once a test message arrives, enable alerts on the templates that
matter.
