import { afterEach, describe, expect, it, vi } from 'vitest'

import { ScanAndFixVulnerabilitiesService } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesService'

// Mock the prompt builder so the cursor assertions don't depend on rendering
// real McpFix objects — we only care about the offset passed to the next page.
vi.mock('../../src/mcp/core/prompts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/mcp/core/prompts')>()),
  fixesPrompt: vi.fn(() => 'PROMPT'),
}))

type Page = {
  fixes: unknown[]
  interactiveFixes: unknown[]
  totalCount: number
}

const fakeFix = (id: string) => ({ id })

describe('ScanAndFixVulnerabilitiesService pagination cursor', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    ScanAndFixVulnerabilitiesService.getInstance().reset()
  })

  // Regression: a page that surfaces only interactive fixes (no applicable
  // ones) must still advance the stateful cursor. Counting applicable fixes
  // alone left the cursor at 0, so back-to-back no-offset calls re-served the
  // identical page (the source of the flaky MVS e2e "pagination advanced"
  // assertion).
  it('advances the cursor by interactive fixes on an interactive-only page', async () => {
    const service = ScanAndFixVulnerabilitiesService.getInstance()
    service.reset()

    const fakeGql = { logMvsEvent: vi.fn().mockResolvedValue(undefined) }
    vi.spyOn(
      service as unknown as { initializeGqlClient: () => Promise<unknown> },
      'initializeGqlClient'
    ).mockResolvedValue(fakeGql)

    const scanFilesModule = await import('../../src/mcp/services/ScanFiles')
    vi.spyOn(scanFilesModule, 'scanFiles').mockResolvedValue({
      fixReportId: 'report-1',
    } as Awaited<ReturnType<typeof scanFilesModule.scanFiles>>)

    const getReportFixes = vi
      .spyOn(
        service as unknown as {
          getReportFixes: (a: { offset?: number }) => Promise<Page>
        },
        'getReportFixes'
      )
      // First page: only interactive fixes are ready (timing-dependent in prod).
      .mockResolvedValueOnce({
        fixes: [],
        interactiveFixes: [fakeFix('i1'), fakeFix('i2')],
        totalCount: 5,
      })
      // Second page: whatever comes next — we only assert the offset it gets.
      .mockResolvedValueOnce({
        fixes: [],
        interactiveFixes: [fakeFix('i3')],
        totalCount: 5,
      })

    await service.processVulnerabilities({
      fileList: ['a.js'],
      repositoryPath: '/tmp/repo',
      limit: 3,
    })
    await service.processVulnerabilities({
      fileList: ['a.js'],
      repositoryPath: '/tmp/repo',
      limit: 3,
    })

    expect(getReportFixes).toHaveBeenCalledTimes(2)
    // First call pages from 0; the two interactive fixes must move the cursor
    // to 2 so the second call does NOT re-serve the same page.
    expect(getReportFixes.mock.calls[0]![0]!.offset).toBe(0)
    expect(getReportFixes.mock.calls[1]![0]!.offset).toBe(2)
  })
})
