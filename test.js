import test from 'bron';
import { strict as assert } from 'assert';
import { factory, runTasks } from 'release-it/test/util/index.js'
import JIRAReleaseNotes from './index.js';

const pluginName = 'jirareleasenotes'
const jiraHost = 'example.atlassian.net'
const ticketPrefixes = ['EXA', 'ATG']

const getOptions = (options) => {
  return {
    ci: true,
    git: { commit: false, tag: false, push: false, requireUpstream: false },
    [pluginName]: options
  }
}

test('should generate changelog if config options are present', async () => {
  const options = getOptions({ jiraHost, ticketPrefixes });
  let jiraReleaseNotes = factory(JIRAReleaseNotes, { options });
  jiraReleaseNotes.getChangelog = async (latestVersion) => {
    return 'feat(EXA-101): Add feature\n chore(ATG-112): Update ci\n'
  }

  await runTasks(jiraReleaseNotes)
  const changelog = jiraReleaseNotes.config.getContext('changelog')

  assert(changelog.includes('feat([EXA-101](https://example.atlassian.net/browse/EXA-101)): Add feature'))
  assert(changelog.includes('chore([ATG-112](https://example.atlassian.net/browse/ATG-112)): Update ci'))
});


test('should generate changelog if config options are absent but env variables are present', async () => {
  const jiraHostEnvironmentVariable = 'RELEASE_IT_JIRA_NOTES_JIRA_HOST'
  const ticketPrefixesEnvironmentVariable = 'RELEASE_IT_JIRA_NOTES_JIRA_TICKET_PREFIXES'

  process.env[jiraHostEnvironmentVariable] = jiraHost
  process.env[ticketPrefixesEnvironmentVariable] = ticketPrefixes
  const options = getOptions({ jiraHost, ticketPrefixes });
  const jiraReleaseNotes = factory(JIRAReleaseNotes, { options });
  jiraReleaseNotes.getChangelog = async (latestVersion) => {
    return 'feat(EXA-101): Add feature\n chore(ATG-112): Update ci\n'
  }

  await runTasks(jiraReleaseNotes)
  const changelog = jiraReleaseNotes.config.getContext('changelog')

  assert(changelog.includes('feat([EXA-101](https://example.atlassian.net/browse/EXA-101)): Add feature'))
  assert(changelog.includes('chore([ATG-112](https://example.atlassian.net/browse/ATG-112)): Update ci'))

  delete process.env[jiraHostEnvironmentVariable]
  delete process.env[ticketPrefixesEnvironmentVariable]
});


test('should be disabled if the config and env variables are not set', async () => {
  const enabled = JIRAReleaseNotes.isEnabled({})

  assert.equal(enabled, false)
});

