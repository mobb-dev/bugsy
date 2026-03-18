import { mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { simpleGit } from 'simple-git'

/**
 * Compute additions between old and new strings using git diff --no-index.
 * Uses git's patience/histogram diff which correctly handles identical tokens
 * at different positions (unlike npm diff's LCS/Myers used by structuredPatch).
 */
export async function computeGitDiffAdditions(
  oldStr: string,
  newStr: string
): Promise<string> {
  const tmpDir = await mkdtemp(path.join(tmpdir(), 'diff-'))
  const oldFile = path.join(tmpDir, 'old')
  const newFile = path.join(tmpDir, 'new')

  try {
    await writeFile(oldFile, oldStr)
    await writeFile(newFile, newStr)

    const git = simpleGit()
    // git diff --no-index exits with 1 when there are differences
    let result: string
    try {
      result = await git.raw([
        'diff',
        '--no-index',
        '--unified=0',
        oldFile,
        newFile,
      ])
    } catch (err: unknown) {
      // simple-git throws on non-zero exit codes; extract the diff output
      if (err instanceof Error && 'stdOut' in err) {
        result = (err as { stdOut: string }).stdOut
      } else {
        throw err
      }
    }

    const additions: string[] = []
    for (const line of result.split('\n')) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        additions.push(line.slice(1))
      }
    }

    return additions.join('\n')
  } finally {
    await rm(tmpDir, { recursive: true, force: true })
  }
}
