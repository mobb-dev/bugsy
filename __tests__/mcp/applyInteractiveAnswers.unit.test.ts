import * as fs from 'fs'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ScanAndFixVulnerabilitiesService } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesService'

vi.mock('../../src/mcp/Logger', () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
  logWarn: vi.fn(),
  logDebug: vi.fn(),
  log: vi.fn(),
}))

const verifyApiConnection = vi.fn(async () => true)
const updateAutoAppliedFixesStatus = vi.fn(async () => undefined)
const updateFixesDownloadStatus = vi.fn(async () => undefined)
const getFixWithAnswers = vi.fn()

const mockGqlClient = {
  verifyApiConnection,
  updateAutoAppliedFixesStatus,
  updateFixesDownloadStatus,
  getFixWithAnswers,
}

vi.mock('../../src/mcp/services/McpGQLClient', () => ({
  createAuthenticatedMcpGQLClient: vi.fn(async () => mockGqlClient),
}))

vi.mock('../../src/mcp/services/types', () => ({
  createMcpLoginContext: vi.fn(() => ({ flow: 'scan_vulnerabilities' })),
}))

const fixturePatch = `diff --git a/render.js b/render.js
--- a/render.js
+++ b/render.js
@@ -1 +1 @@
-document.body.innerHTML = userBio;
+document.body.textContent = userBio;
`

let tmpRepo: string

const writeRepoFile = (relPath: string, content: string) => {
  const full = path.join(tmpRepo, relPath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content, 'utf8')
}

describe('ScanAndFixVulnerabilitiesService.applyInteractiveAnswers', () => {
  beforeEach(() => {
    tmpRepo = fs.mkdtempSync(path.join(process.cwd(), '.tmp-mcp-test-'))
    writeRepoFile('render.js', 'document.body.innerHTML = userBio;\n')
    verifyApiConnection.mockClear()
    getFixWithAnswers.mockReset()
    updateAutoAppliedFixesStatus.mockClear()
    updateFixesDownloadStatus.mockClear()
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    svc.reset()
    ;(svc as unknown as { gqlClient?: unknown }).gqlClient = undefined // singleton would otherwise skip initializeGqlClient
  })

  afterEach(() => {
    fs.rmSync(tmpRepo, { recursive: true, force: true })
  })

  it('applies the tailored patch returned by the server and reports success', async () => {
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: fixturePatch,
        patchOriginalEncodingBase64: 'eA==',
        questions: [],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'XSS fix',
          extraContext: [],
        },
      },
    })

    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-xss',
          answers: [{ key: 'isServerSideCode', value: 'no' }],
        },
      ],
      repositoryPath: tmpRepo,
    })

    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-xss`')
    expect(summary).toContain('`render.js`')
    expect(getFixWithAnswers).toHaveBeenCalledWith({
      fixId: 'fix-xss',
      answers: [{ key: 'isServerSideCode', value: 'no' }],
    })
    const patched = fs.readFileSync(path.join(tmpRepo, 'render.js'), 'utf8')
    expect(patched).toContain('document.body.textContent = userBio;')
    expect(patched).not.toContain('innerHTML')
  })

  it('reports a failure entry when the fix is not found', async () => {
    getFixWithAnswers.mockResolvedValueOnce({ fixData: null })
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        { fixId: 'gone', answers: [{ key: 'k', value: 'v' }] },
      ],
      repositoryPath: tmpRepo,
    })
    expect(summary).toContain('❌ Failed')
    expect(summary).toContain('`gone`')
    expect(summary).toContain('not found')
  })

  it('reports a failure entry when the backend returns GetFixNoFixError', async () => {
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: { __typename: 'GetFixNoFixError' },
    })
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-iframe',
          answers: [{ key: 'iframeRestrictions', value: '' }],
        },
      ],
      repositoryPath: tmpRepo,
    })
    expect(summary).toContain('❌ Failed')
    expect(summary).toContain('GetFixNoFixError')
  })

  it('applies the patch and surfaces a cascading-questions hint when new keys appear in the response', async () => {
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: fixturePatch,
        patchOriginalEncodingBase64: 'eA==',
        // Backend echoes back the original answered question (value populated)
        // and adds a new question we didn't send (real cascading).
        questions: [
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'tainted_term_type',
            name: 'taintedTermType',
            defaultValue: 'a file name',
            value: 'a file path',
            inputType: 'SELECT',
            options: ['a file name', 'a file path'],
            index: 0,
            extraContext: [],
          },
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'path_target_dir',
            name: 'pathTargetDir',
            defaultValue: '/tmp/replace/this/path',
            value: null,
            inputType: 'TEXT',
            options: [],
            index: 1,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'PT cascading',
          extraContext: [],
        },
      },
    })
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-pt',
          answers: [{ key: 'tainted_term_type', value: 'a file path' }],
        },
      ],
      repositoryPath: tmpRepo,
    })
    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-pt`')
    expect(summary).toContain('additional question key(s)')
    expect(summary).toContain('`path_target_dir`')
    expect(summary).not.toContain('❌ Failed')
  })

  it('applies the patch and warns when we sent the wrong key (camelCase) — backend echoes the real key with value=null', async () => {
    // The backend echoes back the question with value=null because the key
    // we sent didn't match anything it knows — it fell back to the default
    // and still produced a patch. We should apply it but flag the dropped
    // answer so the LLM tells the user.
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: fixturePatch,
        patchOriginalEncodingBase64: 'eA==',
        questions: [
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'is_server_side_code',
            name: 'isServerSideCode',
            defaultValue: 'no',
            value: null,
            inputType: 'SELECT',
            options: ['yes', 'no'],
            index: 0,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'XSS',
          extraContext: [],
        },
      },
    })
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          // Wrong key (camelCase). Backend echoes the snake_case key with
          // value=null because nothing matched the camelCase input.
          fixId: 'fix-xss-wrong-key',
          answers: [{ key: 'isServerSideCode', value: 'yes' }],
        },
      ],
      repositoryPath: tmpRepo,
    })
    // We sent `isServerSideCode` (camelCase). The backend echoes
    // `is_server_side_code` (snake_case) with value=null — from our side
    // that's a "new" key the backend revealed, so it shows up in the same
    // cascading-style hint. The patch is still applied (with the default).
    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-xss-wrong-key`')
    expect(summary).toContain('additional question key(s)')
    expect(summary).toContain('`is_server_side_code`')
    expect(summary).toContain('camelCase vs snake_case')
  })

  it('applies the relative-path PT sanitizer when the LLM answers `tainted_term_type` = "a relative path" (MOBB-3604 / JS PT)', async () => {
    // Fixture mirrors clients/cli docs example `relative.js`: a path.join
    // where the tainted variable is a *middle* argument (subdir), so the
    // analyzer's default flips from FILENAME → RELATIVE_PATH
    // (consumers/analyzer/analyzer/fixes/js/pt/analyzer.py:77). The right
    // answer is "a relative path", which routes through the
    // @fixer.define_info_structure(tainted_term_type=RELATIVE_PATH) branch
    // (consumers/analyzer/analyzer/fixes/js/pt/fixer.py:29) and emits the
    // resolve+normalize+slice sanitizer
    // (consumers/analyzer/analyzer/fixes/js/pt/fixer.py:72-77).
    const relativeOriginal = `const path = require('path');
const BACKUP_DIR = '/var/backups/reports';

function readReport(subdir) {
  return path.join(BACKUP_DIR, subdir, 'report.pdf');
}
`
    writeRepoFile('relative.js', relativeOriginal)

    const relativePatch = `diff --git a/relative.js b/relative.js
--- a/relative.js
+++ b/relative.js
@@ -4,3 +4,4 @@
 function readReport(subdir) {
-  return path.join(BACKUP_DIR, subdir, 'report.pdf');
+  const safeInput = path.resolve(path.sep, path.normalize(String(subdir || '').replace('\\0', '').replace(/^(\\.\\.(\\/|\\\\$))+/, ''))).slice(1);
+  return path.join(BACKUP_DIR, safeInput, 'report.pdf');
 }
`

    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: relativePatch,
        patchOriginalEncodingBase64: 'eA==',
        // Backend echoes the question back with `value` populated by what we
        // sent — this is the success contract (not "answers ignored").
        questions: [
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'tainted_term_type',
            name: 'taintedTermType',
            defaultValue: 'a relative path',
            value: 'a relative path',
            inputType: 'SELECT',
            options: ['a file name', 'a relative path', 'an absolute path'],
            index: 10,
            extraContext: [
              {
                __typename: 'UnstructuredFixExtraContext',
                key: 'expression',
                value: 'subdir',
              },
            ],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription:
            'Sanitizes the relative path segment before joining under BACKUP_DIR',
          extraContext: [],
        },
      },
    })

    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-pt-relative',
          answers: [{ key: 'tainted_term_type', value: 'a relative path' }],
        },
      ],
      repositoryPath: tmpRepo,
    })

    // The LLM-supplied answer must be forwarded verbatim — key in snake_case
    // (matches the question's `key` field, not the camelCase `name`) and the
    // value as the exact option string.
    expect(getFixWithAnswers).toHaveBeenCalledWith({
      fixId: 'fix-pt-relative',
      answers: [{ key: 'tainted_term_type', value: 'a relative path' }],
    })

    // Foreground LLM-driven apply via MCP must be tagged with the MCP
    // download source — not the background AutoMvs source used by the
    // periodic check_for_new_available_fixes flow.
    expect(updateFixesDownloadStatus).toHaveBeenCalledWith(['fix-pt-relative'])
    expect(updateAutoAppliedFixesStatus).not.toHaveBeenCalled()

    // Apply summary: clean success, no cascading-questions or wrong-key hint.
    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-pt-relative`')
    expect(summary).toContain('`relative.js`')
    expect(summary).not.toContain('additional question key(s)')
    expect(summary).not.toContain('❌ Failed')

    // File on disk is now sanitized: vulnerable usage replaced with safeInput,
    // and the sanitizer line precedes the sink.
    const patched = fs.readFileSync(path.join(tmpRepo, 'relative.js'), 'utf8')
    expect(patched).toContain(
      'const safeInput = path.resolve(path.sep, path.normalize('
    )
    expect(patched).toContain("path.join(BACKUP_DIR, safeInput, 'report.pdf')")
    expect(patched).not.toContain("path.join(BACKUP_DIR, subdir, 'report.pdf')")
  })

  // Guardrail: LLM sends a SELECT value not in options[] → backend would
  // silently default → we skip the fix and leave the file untouched.
  describe('bad-LLM-response fallback (invalid SELECT value)', () => {
    it('skips the fix and leaves the file untouched when the LLM sends a value that is not in the SELECT options list', async () => {
      const original = `const path = require('path');
const BACKUP_DIR = '/var/backups/reports';

function readReport(subdir) {
  return path.join(BACKUP_DIR, subdir, 'report.pdf');
}
`
      writeRepoFile('relative.js', original)

      const filenameFallbackPatch = `diff --git a/relative.js b/relative.js
--- a/relative.js
+++ b/relative.js
@@ -4,3 +4,4 @@
 function readReport(subdir) {
-  return path.join(BACKUP_DIR, subdir, 'report.pdf');
+  const safeInput = path.basename(String(subdir || '').replace('\\0', '').replace(/^(\\.\\.(\\/|\\\\$))+/, ''));
+  return path.join(BACKUP_DIR, safeInput, 'report.pdf');
 }
`

      getFixWithAnswers.mockResolvedValueOnce({
        fixData: {
          __typename: 'FixData',
          patch: filenameFallbackPatch,
          patchOriginalEncodingBase64: 'eA==',
          questions: [
            {
              __typename: 'FixQuestion',
              content: '',
              description: '',
              guidance: '',
              key: 'tainted_term_type',
              name: 'taintedTermType',
              defaultValue: 'a file name',
              value:
                'a file name — file is joined as a single component under UPLOAD_DIR',
              inputType: 'SELECT',
              options: ['a file name', 'a relative path', 'an absolute path'],
              index: 10,
              extraContext: [],
            },
          ],
          extraContext: {
            __typename: 'FixExtraContextResponse',
            fixDescription: 'PT',
            extraContext: [],
          },
        },
      })

      const svc = ScanAndFixVulnerabilitiesService.getInstance()
      const summary = await svc.applyInteractiveAnswers({
        interactiveAnswers: [
          {
            fixId: 'fix-pt-bad-llm',
            answers: [
              {
                key: 'tainted_term_type',
                // Real Cursor regression: LLM appended commentary instead of using the exact option.
                value:
                  'a file name — file is joined as a single component under UPLOAD_DIR',
              },
            ],
          },
        ],
        repositoryPath: tmpRepo,
      })

      expect(summary).toContain('⏭️ Skipped 1 fix')
      expect(summary).toContain('`fix-pt-bad-llm`')
      expect(summary).toContain('`tainted_term_type`')
      expect(summary).toContain('"a file name — file is joined')
      expect(summary).toContain('`"a file name"`')
      expect(summary).toContain('`"a relative path"`')
      expect(summary).toContain('`"an absolute path"`')
      expect(summary).toContain('file was **not modified**')

      // Dangerous patch must NOT land.
      expect(summary).not.toContain('✅ Applied')
      expect(updateFixesDownloadStatus).not.toHaveBeenCalled()
      expect(updateAutoAppliedFixesStatus).not.toHaveBeenCalled()
      const onDisk = fs.readFileSync(path.join(tmpRepo, 'relative.js'), 'utf8')
      expect(onDisk).toBe(original)
    })

    it('lets free-form TEXT/NUMBER answers through (validation only fires for SELECT)', async () => {
      getFixWithAnswersForFreeForm()
      const svc = ScanAndFixVulnerabilitiesService.getInstance()
      const summary = await svc.applyInteractiveAnswers({
        interactiveAnswers: [
          {
            fixId: 'fix-text',
            answers: [
              { key: 'path_target_dir', value: '/var/uploads/whatever' },
            ],
          },
        ],
        repositoryPath: tmpRepo,
      })
      expect(summary).toContain('✅ Applied 1 fix')
      expect(summary).not.toContain('⏭️ Skipped')
    })

    it('applies valid fix and skips invalid one in the same call', async () => {
      writeRepoFile('good.js', 'document.body.innerHTML = userBio;\n')
      const goodPatch = `diff --git a/good.js b/good.js
--- a/good.js
+++ b/good.js
@@ -1 +1 @@
-document.body.innerHTML = userBio;
+document.body.textContent = userBio;
`
      getFixWithAnswers.mockResolvedValueOnce({
        fixData: {
          __typename: 'FixData',
          patch: goodPatch,
          patchOriginalEncodingBase64: 'eA==',
          questions: [
            {
              __typename: 'FixQuestion',
              content: '',
              description: '',
              guidance: '',
              key: 'is_server_side_code',
              name: 'isServerSideCode',
              defaultValue: 'no',
              value: 'no',
              inputType: 'SELECT',
              options: ['yes', 'no'],
              index: 0,
              extraContext: [],
            },
          ],
          extraContext: {
            __typename: 'FixExtraContextResponse',
            fixDescription: 'XSS',
            extraContext: [],
          },
        },
      })
      getFixWithAnswers.mockResolvedValueOnce({
        fixData: {
          __typename: 'FixData',
          patch: 'placeholder',
          patchOriginalEncodingBase64: 'cA==',
          questions: [
            {
              __typename: 'FixQuestion',
              content: '',
              description: '',
              guidance: '',
              key: 'tainted_term_type',
              name: 'taintedTermType',
              defaultValue: 'a file name',
              value: 'gibberish',
              inputType: 'SELECT',
              options: ['a file name', 'a relative path'],
              index: 10,
              extraContext: [],
            },
          ],
          extraContext: {
            __typename: 'FixExtraContextResponse',
            fixDescription: 'PT',
            extraContext: [],
          },
        },
      })

      const svc = ScanAndFixVulnerabilitiesService.getInstance()
      const summary = await svc.applyInteractiveAnswers({
        interactiveAnswers: [
          {
            fixId: 'fix-xss-good',
            answers: [{ key: 'is_server_side_code', value: 'no' }],
          },
          {
            fixId: 'fix-pt-bad',
            answers: [{ key: 'tainted_term_type', value: 'gibberish' }],
          },
        ],
        repositoryPath: tmpRepo,
      })

      expect(summary).toContain('✅ Applied 1 fix')
      expect(summary).toContain('`fix-xss-good`')
      // Skipped != Failed — refused before applying, file untouched.
      expect(summary).toContain('⏭️ Skipped 1 fix')
      expect(summary).toContain('`fix-pt-bad`')
      expect(summary).not.toContain('❌ Failed')

      const goodOnDisk = fs.readFileSync(path.join(tmpRepo, 'good.js'), 'utf8')
      expect(goodOnDisk).toContain('document.body.textContent = userBio;')
      expect(updateFixesDownloadStatus).toHaveBeenCalledTimes(1)
      expect(updateFixesDownloadStatus).toHaveBeenCalledWith(['fix-xss-good'])
    })
  })

  function getFixWithAnswersForFreeForm() {
    writeRepoFile('text.js', 'document.body.innerHTML = userBio;\n')
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: `diff --git a/text.js b/text.js
--- a/text.js
+++ b/text.js
@@ -1 +1 @@
-document.body.innerHTML = userBio;
+document.body.textContent = userBio;
`,
        patchOriginalEncodingBase64: 'eA==',
        questions: [
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'path_target_dir',
            name: 'pathTargetDir',
            defaultValue: '/tmp/replace/this/path',
            value: '/var/uploads/whatever',
            inputType: 'TEXT',
            options: [],
            index: 0,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'Free-form text',
          extraContext: [],
        },
      },
    })
  }

  it('applies the patch cleanly when the backend echoes the same answered question (no cascading, no dropped values)', async () => {
    // Common success path: LLM sent the right key with a recognised value.
    // The backend regenerates the patch and echoes the question with the
    // value we provided — nothing to flag, just apply.
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: fixturePatch,
        patchOriginalEncodingBase64: 'eA==',
        questions: [
          {
            __typename: 'FixQuestion',
            content: '',
            description: '',
            guidance: '',
            key: 'is_server_side_code',
            name: 'isServerSideCode',
            defaultValue: 'no',
            value: 'yes',
            inputType: 'SELECT',
            options: ['yes', 'no'],
            index: 0,
            extraContext: [],
          },
        ],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'XSS',
          extraContext: [],
        },
      },
    })
    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-xss-clean',
          answers: [{ key: 'is_server_side_code', value: 'yes' }],
        },
      ],
      repositoryPath: tmpRepo,
    })
    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-xss-clean`')
    expect(summary).not.toContain('additional question key(s)')
    expect(summary).not.toContain('❌ Failed')
  })

  it('processes multiple fixes in one call and produces a combined summary', async () => {
    getFixWithAnswers.mockResolvedValueOnce({
      fixData: {
        __typename: 'FixData',
        patch: fixturePatch,
        patchOriginalEncodingBase64: 'eA==',
        questions: [],
        extraContext: {
          __typename: 'FixExtraContextResponse',
          fixDescription: 'XSS fix',
          extraContext: [],
        },
      },
    })
    getFixWithAnswers.mockResolvedValueOnce({ fixData: null })

    const svc = ScanAndFixVulnerabilitiesService.getInstance()
    const summary = await svc.applyInteractiveAnswers({
      interactiveAnswers: [
        {
          fixId: 'fix-xss',
          answers: [{ key: 'isServerSideCode', value: 'no' }],
        },
        { fixId: 'fix-missing', answers: [{ key: 'k', value: 'v' }] },
      ],
      repositoryPath: tmpRepo,
    })
    expect(summary).toContain('✅ Applied 1 fix')
    expect(summary).toContain('`fix-xss`')
    expect(summary).toContain('❌ Failed')
    expect(summary).toContain('`fix-missing`')
  })
})
