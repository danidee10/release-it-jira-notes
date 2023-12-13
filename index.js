// This  plugin searches for JIRA tickets (with a predefined prefix)
// and replaces the prefix with a markdown URL to the JIRA ticket
import { Plugin } from 'release-it'

const jiraHostEnvironmentVariable = 'RELEASE_IT_JIRA_NOTES_JIRA_HOST'
const ticketPrefixesEnvironmentVariable = 'RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES'

export default class JIRAReleaseNotes extends Plugin {

  static isEnabled(options) {
    let enabled = true

    if (typeof options.jiraHost !== 'string' && !process.env[jiraHostEnvironmentVariable]) {
      console.error(
        `Plese set the "jiraHost" key or the ${jiraHostEnvironmentVariable} environment variable`
      )
      enabled = false
    }

    if (options.ticketPrefixes?.isArray() === undefined && !process.env[ticketPrefixesEnvironmentVariable]) {
      console.error(
        `Please set the "ticketPrefixes" key or the ${ticketPrefixesEnvironmentVariable}
environment variable to a comma separated value of strings e.g ABC,DEF`
      )
      enabled = false
    }

    if (enabled === false) {
      console.error(
        `The plugin has been disabled because:
one or more options are missing/misconfigured, Please configure them`
      )
    }

    return enabled
  }

  getInitialOptions(options, pluginName) {
    let jiraHost = options.jiraHost
    let ticketPrefixes = options.ticketPrefixes

    if (jiraHost === undefined) {
      jiraHost = process.env[jiraHostEnvironmentVariable]
    }

    if (ticketPrefixes === undefined) {
      ticketPrefixes = process.env[ticketPrefixesEnvironmentVariable].split(',')
    }

    return Object.assign({}, options[pluginName], {
      jiraHost, ticketPrefixes
    })
  }

  /* Override the changelog as early as possible
  async getChangelog(latestVersion) {
    const conventionalChangeLogPlugin = new ConventionalChangeLogPlugin(
      {
        namespace: '@release-it/conventional-changelog',
        options: this.config.options,
        container: { ...this },
      }
    )
    let changelog = await conventionalChangeLogPlugin.getChangelog(latestVersion)

    const { jiraHost, ticketPrefixes } = this.options

    for (const prefix of ticketPrefixes) {
      const regex = new RegExp(`(${prefix}-\\w+)`, 'g')
      changelog = changelog.replaceAll(regex, `[$1](https://${jiraHost}/browse/$1)`)
    }

    this.debug('Updated changelog', changelog)
    this.setContext({ changelog })
    this.config.setContext({ changelog })

    return changelog
  }*/

  jirafyChangelog(changelog, options) {
    const { jiraHost, ticketPrefixes } = options

    for (const prefix of ticketPrefixes) {
      const regex = new RegExp(`(${prefix}-\\w+)`, 'g')
      changelog = changelog.replaceAll(regex, `[$1](https://${jiraHost}/browse/$1)`)
    }

    return changelog
  }

  beforeRelease() {
    let changelog = this.config.getContext('changelog')

    changelog = this.jirafyChangelog(changelog, this.options)
    this.debug('Updated changelog', changelog)

    this.config.setContext({ changelog })
  }
}
