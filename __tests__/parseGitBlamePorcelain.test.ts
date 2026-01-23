import {
  buildGitBlameArgs,
  parseGitBlamePorcelainByLine,
} from '@mobb/bugsy/utils/blame/gitBlameUtils'
import { createGitWithLogging } from '@mobb/bugsy/utils/gitUtils'
import * as path from 'path'

describe('parseGitBlamePorcelain', () => {
  it('parses real file and matches hash and author for a line', async () => {
    // Path to the real file in assets
    const filePath = path.resolve(
      __dirname,
      'assets/simple/src/main/java/SigningAssignment.java'
    )
    // Run git blame --porcelain on the file

    const args = buildGitBlameArgs({
      filePath: filePath,
      mode: 'workingTree',
    })

    const git = createGitWithLogging(
      path.dirname(path.dirname(path.dirname(filePath))),
      console
    )
    const blameOutput = await git.raw(args)

    // Parse the porcelain format output to extract line -> hash mapping, including author info
    const lines = parseGitBlamePorcelainByLine(blameOutput)

    const lineIndex = 1
    const lineInfo = lines[lineIndex]
    // Confirm the lineInfo matches expected commit and author
    expect(lineInfo).toBeTruthy()
    // Print the lineInfo object for debug
    // eslint-disable-next-line no-console
    expect(lineInfo?.commit).toHaveLength(40)
    expect(lineInfo?.originalLine).toBeGreaterThan(0)
    expect(lineInfo?.authorName).toBeTypeOf('string')
    expect(lineInfo?.authorEmail).toBeTypeOf('string')
    expect(lineInfo?.authorTime).toBeGreaterThan(1600000000)
  })
})
