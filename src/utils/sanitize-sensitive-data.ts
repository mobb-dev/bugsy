import { OpenRedaction } from '@openredaction/openredaction'
import { spawn } from 'child_process'
// @ts-expect-error - gitleaks-secret-scanner doesn't have type definitions
import { installGitleaks } from 'gitleaks-secret-scanner/lib/installer.js'

// Initialize OpenRedaction with comprehensive PII patterns while avoiding false-positive-prone patterns
const openRedaction = new OpenRedaction({
  patterns: [
    // Core Personal Data
    'EMAIL',
    'SSN',
    'NATIONAL_INSURANCE_UK',
    'DATE_OF_BIRTH',

    // Identity Documents
    'PASSPORT_UK',
    'PASSPORT_US',
    'PASSPORT_MRZ_TD1',
    'PASSPORT_MRZ_TD3',
    'DRIVING_LICENSE_UK',
    'DRIVING_LICENSE_US',
    'VISA_NUMBER',
    'VISA_MRZ',
    'TAX_ID',

    // Financial Data
    'CREDIT_CARD',
    'IBAN',
    'BANK_ACCOUNT_UK',
    'ROUTING_NUMBER_US',
    'SWIFT_BIC',
    'CARD_TRACK1_DATA',
    'CARD_TRACK2_DATA',
    'CARD_EXPIRY',
    'CARD_AUTH_CODE',

    // Cryptocurrency
    'BITCOIN_ADDRESS',
    'ETHEREUM_ADDRESS',
    'LITECOIN_ADDRESS',
    'CARDANO_ADDRESS',
    'SOLANA_ADDRESS',
    'MONERO_ADDRESS',
    'RIPPLE_ADDRESS',

    // Medical Data
    'NHS_NUMBER',
    'MEDICAL_RECORD_NUMBER',
    'AUSTRALIAN_MEDICARE',
    'HEALTH_PLAN_NUMBER',
    'PRESCRIPTION_NUMBER',
    'PATIENT_ID',

    // Communications
    'PHONE_US',
    'PHONE_UK',
    'PHONE_UK_MOBILE',
    'PHONE_INTERNATIONAL',
    'PHONE_LINE_NUMBER',
    'EMERGENCY_CONTACT',
    'ADDRESS_STREET',
    'ADDRESS_PO_BOX',
    'POSTCODE_UK',
    'ZIP_CODE_US',

    // Network & Technical
    'IPV4',
    'IPV6',
    'MAC_ADDRESS',
    'URL_WITH_AUTH',

    // Security Keys & Tokens
    'PRIVATE_KEY',
    'SSH_PRIVATE_KEY',
    'AWS_SECRET_KEY',
    'AWS_ACCESS_KEY',
    'AZURE_STORAGE_KEY',
    'GCP_SERVICE_ACCOUNT',
    'JWT_TOKEN',
    'OAUTH_TOKEN',
    'OAUTH_CLIENT_SECRET',
    'BEARER_TOKEN',
    'PAYMENT_TOKEN',
    'GENERIC_SECRET',
    'GENERIC_API_KEY',

    // Platform-Specific API Keys
    'GITHUB_TOKEN',
    'SLACK_TOKEN',
    'STRIPE_API_KEY',
    'GOOGLE_API_KEY',
    'FIREBASE_API_KEY',
    'HEROKU_API_KEY',
    'MAILGUN_API_KEY',
    'SENDGRID_API_KEY',
    'TWILIO_API_KEY',
    'NPM_TOKEN',
    'PYPI_TOKEN',
    'DOCKER_AUTH',
    'KUBERNETES_SECRET',

    // Government & Legal
    'POLICE_REPORT_NUMBER',
    'IMMIGRATION_NUMBER',
    'COURT_REPORTER_LICENSE',
    'CLIENT_ID',
  ],
})

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

    // Apply PII detection using OpenRedaction (now configured with security-focused patterns only)
    const piiDetections = openRedaction.scan(str)
    if (piiDetections && piiDetections.total > 0) {
      const allDetections = [
        ...piiDetections.high,
        ...piiDetections.medium,
        ...piiDetections.low,
      ]

      // Count PII by severity and sanitize
      for (const detection of allDetections) {
        counts.pii.total++
        if (detection.severity === 'high') counts.pii.high++
        else if (detection.severity === 'medium') counts.pii.medium++
        else if (detection.severity === 'low') counts.pii.low++

        const masked = maskString(detection.value)
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
