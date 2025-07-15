import fs from 'fs/promises'
import { globby } from 'globby'
import os from 'os'
import path from 'path'
import simpleGit from 'simple-git'

/**
 * Creates a temporary directory and clones a GitHub repository into it
 * @param {string} repoUrl - The repository URL to clone
 * @param {string} [branch='main'] - The branch to clone
 * @returns {string} - The path to the temporary directory with the cloned repository
 */
export async function cloneRepository(repoUrl, branch = 'main') {
  // Create temporary directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-'))
  console.log(`Created temp directory and cloning ${repoUrl}...`)

  // Use simple-git to perform a shallow clone
  const git = simpleGit()
  await git.clone(repoUrl, tempDir, [
    '--depth',
    '1',
    '--branch',
    branch,
    '--single-branch',
  ])

  return tempDir
}

/**
 * Finds Java files in a specific directory within the repository
 * @param {string} repoDir - The repository directory
 * @param {string} targetPath - The target path within the repository
 * @returns {string[]} - List of Java file paths
 */
export async function findJavaFiles(repoDir, targetPath) {
  const targetDir = path.join(repoDir, targetPath)

  try {
    // If the directory exists in the expected location, return its Java files
    await fs.access(targetDir)
    return await globby('**/*.java', {
      cwd: targetDir,
      absolute: true,
    })
  } catch {
    // Directory not found in the expected place – look for it elsewhere to inform the caller
    const dirName = path.basename(targetPath)
    // Look elsewhere for the directory (result not needed—presence is enough for callers)
    await globby(`**/${dirName}`, {
      cwd: repoDir,
      onlyDirectories: true,
    })

    return [] // Let the caller decide how to handle missing files
  }
}

/**
 * Finds Java files in multiple directories within the repository
 * @param {string} repoDir - The repository directory
 * @param {string[]} targetPaths - Array of target paths within the repository
 * @returns {string[]} - Combined list of Java file paths from all directories
 */
export async function findJavaFilesInMultipleDirs(repoDir, targetPaths) {
  let allJavaFiles = []

  for (const targetPath of targetPaths) {
    const files = await findJavaFiles(repoDir, targetPath)
    allJavaFiles = allJavaFiles.concat(files)
  }

  return allJavaFiles
}

/**
 * Creates test Java files in a directory
 * @param {string} targetDir - The directory to create files in
 * @returns {string[]} - Paths to the created files
 */
export async function createTestJavaFiles(targetDir) {
  try {
    await fs.access(targetDir)
  } catch {
    await fs.mkdir(targetDir, { recursive: true })
  }

  // Create test files
  const files = [
    { name: 'User.java', content: 'public class User { /* Test file */ }' },
    {
      name: 'UserRepository.java',
      content: 'public class UserRepository { /* Test file */ }',
    },
  ]

  const filePaths = []

  for (const file of files) {
    const filePath = path.join(targetDir, file.name)
    await fs.writeFile(filePath, file.content)
    filePaths.push(filePath)
  }

  return filePaths
}

/**
 * Adds a space to the end of each file
 * @param {string[]} filePaths - List of file paths
 */
export async function addSpaceToFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      await fs.writeFile(filePath, content + ' ', 'utf-8')
    } catch (error) {
      console.error(
        `Error adding space to ${String(filePath).replace(/\n|\r/g, '')}:`,
        error
      )
    }
  }
}

/**
 * Finds and adds spaces to specific files by name regardless of their locationm
 * @param {string} repoDir - The repository directory
 * @param {string[]} targetFileNames - List of target file names (e.g. 'User.java')
 * @returns {string[]} - List of modified file paths
 */
export async function addSpaceToSpecificFiles(repoDir, targetFileNames) {
  console.log(`Modifying target files in repository...`)

  const modifiedFiles = []

  try {
    // Find each specific file in the repository
    for (const fileName of targetFileNames) {
      // Locate the file anywhere in the repository using globby
      const foundPaths = await globby(`**/${fileName}`, {
        cwd: repoDir,
        absolute: true,
      })

      if (foundPaths.length === 0) {
        continue
      }

      // Add space to each found file
      for (const filePath of foundPaths) {
        try {
          const content = await fs.readFile(filePath, 'utf-8')
          await fs.writeFile(filePath, content + ' ', 'utf-8')
          modifiedFiles.push(filePath)
        } catch (fileError) {
          console.error(
            `Error adding space to ${String(filePath).replace(/\n|\r/g, '')}:`,
            fileError
          )
        }
      }
    }

    if (modifiedFiles.length > 0) {
      console.log(`Modified ${modifiedFiles.length} files`)
    }

    return modifiedFiles
  } catch (error) {
    console.error('Error processing specific files:', error)
    return modifiedFiles
  }
}

/**
 * Gets the git status of the repository
 * @param {string} repoDir - The repository directory
 * @returns {string} - The git status output
 */
export async function getGitStatus(repoDir) {
  try {
    const git = simpleGit(repoDir)
    const statusText = await git.raw(['status'])
    return statusText
  } catch (error) {
    console.error('Error getting git status:', error)
    return 'Failed to get git status'
  }
}

/**
 * Cleans up the temporary directory
 * @param {string} tempDir - The temporary directory to clean up
 */
export async function cleanupRepository(tempDir) {
  if (tempDir) {
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
      // ignore if directory already gone
    }
  }
}
