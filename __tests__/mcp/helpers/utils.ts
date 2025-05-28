import { execSync, spawn } from 'child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { MCPClient } from './MCPClient'

// Utility for log handling based on environment variable
export const isVerboseLogging = process.env['LOG_LEVEL'] !== 'silent'

export function log(...args: unknown[]) {
  if (isVerboseLogging) {
    console.log(...args)
  }
}

/**
 * Creates an empty git repository in a temporary directory
 * @returns Path to the created git repository
 */
export function createEmptyGitRepo(): string {
  // Create temp directory and initialize a git repo
  const repoPath = mkdtempSync(join(tmpdir(), 'mcp-test-empty-repo-'))
  log('Created empty repo at:', repoPath)

  // Initialize git repo in the empty directory with quiet flag and explicit branch name
  execSync('git init -q --initial-branch=main', {
    cwd: repoPath,
  })

  // Make an initial commit so the repo has a HEAD
  execSync('git config user.name "Test User"', { cwd: repoPath })
  execSync('git config user.email "test@example.com"', { cwd: repoPath })
  execSync('git commit --allow-empty -m "Initial commit"', {
    cwd: repoPath,
  })
  log('Git repository initialized with empty commit')

  return repoPath
}

/**
 * Creates a git repository with a staged file (but not committed)
 * @param filename Optional filename to create, defaults to 'sample.js'
 * @param content Optional content for the file, defaults to code with a vulnerability
 * @returns Path to the created git repository
 */
export function createActiveGitRepo(
  filename = 'sample.js',
  content = 'function test() { eval(userInput); }' // Vulnerable code
): string {
  // First create an empty repo
  const repoPath = createEmptyGitRepo()

  // Create a sample file in the repository
  const filePath = join(repoPath, filename)
  writeFileSync(filePath, content)
  log(`Created file ${filename} in repo`)

  // Add the file to git staging
  execSync(`git add ${filename}`, { cwd: repoPath })
  log(`Added ${filename} to git staging`)

  // Commit the file so it exists in HEAD (required for pack function)
  execSync(`git commit -m "Add ${filename}"`, { cwd: repoPath })
  log(`Committed ${filename} to HEAD`)

  // Now modify the file so it shows up in git status as changed
  writeFileSync(filePath, content + '\n// Modified for testing')
  log(`Modified ${filename} to create changes`)

  return repoPath
}

/**
 * Deletes a git repository
 * @param repoPath Path to the git repository to delete
 */
export function deleteGitRepo(repoPath: string): void {
  if (existsSync(repoPath)) {
    rmSync(repoPath, { recursive: true, force: true })
    log(`Cleaned up repo at: ${repoPath}`)
  }
}

/**
 * Creates and starts an MCP server process
 * @returns A Promise that resolves with the spawned process and client
 */
export async function createMCPProcess(): Promise<ReturnType<typeof spawn>> {
  // Start the MCP server using the main CLI with mcp command
  const cliPath = join(process.cwd(), 'dist', 'index.mjs')
  log(`Starting MCP server from: ${cliPath}`)

  const mcpProcess = spawn('node', [cliPath, 'mcp'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
  })

  // Log process output for debugging
  mcpProcess.stdout?.on('data', (data) => {
    log(`MCP stdout: ${data.toString().trim()}`)
  })

  mcpProcess.stderr?.on('data', (data) => {
    log(`MCP stderr: ${data.toString().trim()}`)
  })

  // Wait for server to start by testing the listTools endpoint
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('MCP server failed to start'))
    }, 30000)

    const testConnection = async () => {
      try {
        const client = new MCPClient(mcpProcess)
        await client.listTools()
        clearTimeout(timeout)
        log('MCP server is ready - listTools endpoint responded')
        resolve()
      } catch (error) {
        // Server not ready yet, try again
        setTimeout(testConnection, 500)
      }
    }

    // Give the server a moment to start, then begin testing
    setTimeout(testConnection, 1000)
  })

  return mcpProcess
}
