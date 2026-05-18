import { describe, expect, it, vi } from 'vitest'

import { interactiveAnswersAbstainAllToolResponse } from '../../src/mcp/core/prompts'
import * as GetLocalFiles from '../../src/mcp/services/GetLocalFiles'
import * as PathValidation from '../../src/mcp/services/PathValidation'
import { ScanAndFixVulnerabilitiesService } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesService'
import { ScanAndFixVulnerabilitiesTool } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesTool'

describe('ScanAndFixVulnerabilitiesTool interactive abstention', () => {
  it('does not scan or apply when interactiveAnswers is an empty array', async () => {
    vi.spyOn(PathValidation, 'validatePath').mockResolvedValue({
      isValid: true,
      path: '/tmp/repo',
    })
    const getLocalFilesSpy = vi
      .spyOn(GetLocalFiles, 'getLocalFiles')
      .mockRejectedValue(new Error('should not scan'))
    const applySpy = vi.spyOn(
      ScanAndFixVulnerabilitiesService.prototype,
      'applyInteractiveAnswers'
    )

    ScanAndFixVulnerabilitiesService.getInstance().reset()
    const tool = new ScanAndFixVulnerabilitiesTool()

    const result = await tool.execute({
      path: '/tmp/repo',
      interactiveAnswers: [],
    })

    expect(result.content[0]?.text).toBe(
      interactiveAnswersAbstainAllToolResponse
    )
    expect(getLocalFilesSpy).not.toHaveBeenCalled()
    expect(applySpy).not.toHaveBeenCalled()
  })
})
