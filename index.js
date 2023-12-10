// This  plugin searches for JIRA tickets (with a predefined prefix)
// and replaces the prefix with a markdown URL to the Jira ticket
import { Plugin } from 'release-it'

export default class JIRAReleaseNotes extends Plugin {


  static isEnabled(options) {
    let enabled = true

    if (typeof options.jiraHost !== 'string' && !process.env['RELEASE_IT_JIRA_NOTES_JIRA_HOST']) {
      console.error(
        'Plese set the "jiraHost" key or the RELEASE_IT_JIRA_NOTES_JIRA_HOST environment variable'
      )
      enabled = false
    }

    if (options.ticketPrefixes?.isArray() === undefined && !process.env['RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES']) {
      console.error(
        `Please set the "ticketPrefixes" key or the RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES
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

    if(jiraHost === undefined) {
      jiraHost = process.env['RELEASE_IT_JIRA_NOTES_JIRA_HOST']
    }

    if (ticketPrefixes === undefined) {
      ticketPrefixes = process.env['RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES'].split(',')
    }

    return Object.assign({}, options[pluginName], {
      jiraHost, ticketPrefixes
    })
}

  beforeRelease() {
    let changelog = this.config.getContext('changelog')

    const { jiraHost, ticketPrefixes } = this.options
    
    for (const prefix of ticketPrefixes) {
      const regex = new RegExp(`(${prefix}-\\w+)`, 'g')

      changelog = changelog.replaceAll(regex, `[$1](https://${jiraHost}/browse/$1)`)
    }

    this.debug('Updated changelog', changelog)

    this.config.setContext({ changelog })
  }
}