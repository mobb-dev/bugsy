import { OpenRedaction } from '@openredaction/openredaction'
import { spawn } from 'child_process'
// @ts-expect-error - gitleaks-secret-scanner doesn't have type definitions
import { installGitleaks } from 'gitleaks-secret-scanner/lib/installer.js'

// Initialize OpenRedaction with all patterns, but we'll filter out problematic ones
const openRedaction = new OpenRedaction()

let gitleaksBinaryPath: string | null = null

// Initialize gitleaks binary path
async function initializeGitleaks(): Promise<string | null> {
  try {
    gitleaksBinaryPath = await installGitleaks({ version: '8.27.2' })
    return gitleaksBinaryPath
  } catch {
    // Silently fail if gitleaks cannot be installed
    return null
  }
}

// Initialize on module load
const gitleaksInitPromise = initializeGitleaks()

async function detectSecretsWithGitleaks(text: string): Promise<Set<string>> {
  const secrets = new Set<string>()

  // Ensure gitleaks is initialized
  const binaryPath = gitleaksBinaryPath || (await gitleaksInitPromise)
  if (!binaryPath) {
    return secrets
  }

  return new Promise((resolve) => {
    const gitleaks = spawn(
      binaryPath,
      [
        'detect',
        '--pipe',
        '--no-banner',
        '--exit-code',
        '0',
        '--report-format',
        'json',
      ],
      {
        stdio: ['pipe', 'pipe', 'ignore'],
      }
    )

    let output = ''

    gitleaks.stdout.on('data', (data) => {
      output += data.toString()
    })

    gitleaks.on('close', () => {
      try {
        const findings = JSON.parse(output)
        if (Array.isArray(findings)) {
          for (const finding of findings) {
            if (finding.Secret) {
              secrets.add(finding.Secret)
            }
          }
        }
      } catch {
        // Failed to parse JSON, no secrets found
      }
      resolve(secrets)
    })

    gitleaks.on('error', () => {
      // If gitleaks fails, return empty set
      resolve(secrets)
    })

    // Write the text to stdin
    gitleaks.stdin.write(text)
    gitleaks.stdin.end()
  })
}

function maskString(str: string, showStart = 2, showEnd = 2): string {
  if (str.length <= showStart + showEnd) {
    return '*'.repeat(str.length)
  }
  return (
    str.slice(0, showStart) +
    '*'.repeat(str.length - showStart - showEnd) +
    str.slice(-showEnd)
  )
}

export type SanitizationCounts = {
  pii: {
    total: number
    high: number
    medium: number
    low: number
  }
  secrets: number
}

export type SanitizationResult = {
  sanitizedData: unknown
  counts: SanitizationCounts
}

export async function sanitizeDataWithCounts(
  obj: unknown
): Promise<SanitizationResult> {
  const counts: SanitizationCounts = {
    pii: { total: 0, high: 0, medium: 0, low: 0 },
    secrets: 0,
  }

  const sanitizeString = async (str: string): Promise<string> => {
    let result = str

    // First apply PII detection using OpenRedaction
    const piiDetections = openRedaction.scan(str)
    if (piiDetections && piiDetections.total > 0) {
      const allDetections = [
        ...piiDetections.high,
        ...piiDetections.medium,
        ...piiDetections.low,
      ]
      // Filter out overly broad patterns that cause false positives
      const filteredDetections = allDetections.filter((detection) => {
        // Skip Instagram username detection as it's too broad (matches "config", "ig", etc.)
        if (detection.type === 'INSTAGRAM_USERNAME') {
          return false
        }
        // Skip very short detections (less than 3 chars) unless they're high severity
        if (detection.value.length < 3 && detection.severity !== 'high') {
          return false
        }
        return true
      })

      // Count PII by severity
      for (const detection of filteredDetections) {
        counts.pii.total++
        if (detection.severity === 'high') counts.pii.high++
        else if (detection.severity === 'medium') counts.pii.medium++
        else if (detection.severity === 'low') counts.pii.low++

        const masked = maskString(detection.value)
        // Use replaceAll to ensure all occurrences are replaced
        result = result.replaceAll(detection.value, masked)
      }
    }

    // Then apply secret detection using Gitleaks
    const secrets = await detectSecretsWithGitleaks(result)
    counts.secrets += secrets.size
    for (const secret of secrets) {
      const masked = maskString(secret)
      // Replace ALL occurrences of the secret in the text
      // Note: simple string.replace() only replaces the first occurrence
      // We use replaceAll() to replace all occurrences
      result = result.replaceAll(secret, masked)
    }

    return result
  }

  const sanitizeRecursive = async (data: unknown): Promise<unknown> => {
    if (typeof data === 'string') {
      return sanitizeString(data)
    } else if (Array.isArray(data)) {
      return Promise.all(data.map((item) => sanitizeRecursive(item)))
    } else if (data instanceof Error) {
      return data
    } else if (data instanceof Date) {
      return data
    } else if (typeof data === 'object' && data !== null) {
      const sanitized: Record<string, unknown> = {}
      const record = data as Record<string, unknown>

      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          sanitized[key] = await sanitizeRecursive(record[key])
        }
      }
      return sanitized
    }

    return data
  }

  const sanitizedData = await sanitizeRecursive(obj)
  return { sanitizedData, counts }
}

export async function sanitizeData(obj: unknown): Promise<unknown> {
  const result = await sanitizeDataWithCounts(obj)
  return result.sanitizedData
}
