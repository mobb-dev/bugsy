import fs from 'node:fs'
import path from 'node:path'
import stream from 'node:stream'
import { promisify } from 'node:util'

import { RequestError } from '@octokit/request-error'
import chalk from 'chalk'
import Debug from 'debug'
import extract from 'extract-zip'
import fetch from 'node-fetch'
import { Octokit } from 'octokit'

import { CliError, Spinner } from '../../../utils'
import type { GetRepoResponse } from './types'

const pipeline = promisify(stream.pipeline)
const debug = Debug('mobbdev:github')

type Options = { token?: string }

async function _getRepo(
  { owner, repo }: { owner: string; repo: string },
  { token }: Options = {}
): Promise<GetRepoResponse> {
  const octokit = new Octokit({ auth: token })
  return octokit.rest.repos.get({
    owner,
    repo,
  })
}

function extractSlug(repoUrl: string) {
  debug('get default branch %s', repoUrl)
  let slug = repoUrl.replace(/https?:\/\/github\.com\//i, '')

  if (slug.endsWith('/')) {
    slug = slug.substring(0, slug.length - 1)
  }

  if (slug.endsWith('.git')) {
    slug = slug.substring(0, slug.length - '.git'.length)
  }
  debug('slug %s', slug)
  return slug
}

function parseRepoUrl(repoUrl: string) {
  const slug = extractSlug(repoUrl)
  const [owner, repo] = slug.split('/')
  if (!owner || !repo) {
    throw new Error(`Error parsing repo url ${repoUrl}}`)
  }
  return { owner, repo }
}

export async function canReachRepo(
  repoUrl: string,
  { token }: Options = {}
): Promise<GetRepoResponse | false> {
  const repoAndOnwer = parseRepoUrl(repoUrl)
  try {
    const res = await _getRepo(repoAndOnwer, { token })
    return res
  } catch (e) {
    if (e instanceof RequestError) {
      return false
    }
    throw e
  }
}

export async function getRepo(
  repoUrl: string,
  { token }: Options = {}
): Promise<GetRepoResponse> {
  const repoAndOnwer = parseRepoUrl(repoUrl)
  try {
    const res = await _getRepo(repoAndOnwer, { token })
    return res
  } catch (e) {
    if (e instanceof RequestError) {
      debug('GH request failed %s %s', e.message, e.status)
      throw new CliError(
        `Can't get repository, make sure you have access to : ${repoUrl}.`
      )
    }
    throw e
  }
}
type DownloadRepoParams = {
  repoUrl: string
  reference: string
  dirname: string
  ci: boolean
}
export async function downloadRepo(
  { repoUrl, reference, dirname, ci }: DownloadRepoParams,
  { token }: Options = {}
) {
  const { createSpinner } = Spinner({ ci })
  const repoSpinner = createSpinner('💾 Downloading Repo').start()
  debug('download repo %s %s %s', repoUrl, reference, dirname)
  const zipFilePath = path.join(dirname, 'repo.zip')
  const response = await fetch(`${repoUrl}/zipball/${reference}`, {
    method: 'GET',
    headers: {
      ...(token && { Authorization: `bearer ${token}` }),
    },
  })
  if (!response.ok) {
    debug('GH zipball request failed %s %s', response.body, response.status)
    repoSpinner.error({ text: '💾 Repo download failed' })
    throw new Error(
      `Can't access the the branch ${chalk.bold(reference)} on ${chalk.bold(
        repoUrl
      )} make sure it exits.`
    )
  }

  const fileWriterStream = fs.createWriteStream(zipFilePath)
  if (!response.body) {
    throw new Error('Response body is empty')
  }

  await pipeline(response.body, fileWriterStream)
  await extract(zipFilePath, { dir: dirname })

  const repoRoot = fs
    .readdirSync(dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)[0]
  if (!repoRoot) {
    throw new Error('Repo root not found')
  }
  debug('repo root %s', repoRoot)
  repoSpinner.success({ text: '💾 Repo downloaded successfully' })
  return path.join(dirname, repoRoot)
}
