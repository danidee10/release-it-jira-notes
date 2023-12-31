# release-it-jira-notes

[![npm latest version](https://img.shields.io/npm/v/release-it-jira-notes/latest.svg)](https://www.npmjs.com/package/release-it-jira-notes)

[**release-it**](https://github.com/release-it/release-it) plugin to add links to
JIRA issues in the release notes.

For each JIRA issue detected in the release notes, it will add a link to the JIRA ticket.


| Step               | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `verifyConditions` | Validate the config options                          |
| `generateNotes`    | Generate the release notes with links to JIRA issues |

### Installation

```bash
$ npm install --save-dev release-it-jira-notes
$ yarn add --dev release-it-jira-notes
```

### Inputs

| Name           | Required | Description                                                            |
| -------------- | :------: | ---------------------------------------------------------------------- |
| jiraHost       |    ✅     | Your JIRA host domain name                                            |
| ticketPrefixes |    ✅     | Ticket prefixes to match. If not provided, match all tickets prefixes.|

### Configuration

```json
{
  "plugins": [
    "@release-it/conventional-changelog": {},
    "release-it-jira-notes", {
      "jiraHost": "example.atlassian.net",
      "ticketPrefixes": ["EXA", "ATG"]
    }
  ]
}
```

> **Note**: The plugin can also be configured via the following environment variables

`RELEASE_IT_JIRA_NOTES_JIRA_HOST` for `jiraHost`

and

`RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES` for `ticketPrefixes`


This plugin is agnostic and will work with any `release-it` plugin that generates it's own changelog. You jut have to make sure you access the updated `changelog` after the `beforeRelease` hook