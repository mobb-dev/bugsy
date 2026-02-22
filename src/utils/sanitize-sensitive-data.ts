import { OpenRedaction } from '@openredaction/openredaction'

// Initialize OpenRedaction with comprehensive PII and secrets patterns while avoiding false-positive-prone patterns
const openRedaction = new OpenRedaction({
  patterns: [
    // Core Personal Data
    // Removed EMAIL - causes false positives in code/test snippets (e.g. --author="Eve Author <eve@example.com>")
    // Prefer false negatives over false positives for this use case.
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

    // Financial Data (removed SWIFT_BIC, CARD_AUTH_CODE - too broad, causing false positives with authentication words)
    // Removed CREDIT_CARD - causes false positives on zero-filled UUIDs (e.g. '00000000-0000-0000-0000-000000000000')
    // Prefer false negatives over false positives for this use case.
    'IBAN',
    'BANK_ACCOUNT_UK',
    'ROUTING_NUMBER_US',
    'CARD_TRACK1_DATA',
    'CARD_TRACK2_DATA',
    'CARD_EXPIRY',

    // Cryptocurrency (removed BITCOIN_ADDRESS - too broad, matches hash-like strings)
    'ETHEREUM_ADDRESS',
    'LITECOIN_ADDRESS',
    'CARDANO_ADDRESS',
    'SOLANA_ADDRESS',
    'MONERO_ADDRESS',
    'RIPPLE_ADDRESS',

    // Medical Data (removed PRESCRIPTION_NUMBER - too broad, matches words containing "ription")
    // Removed MEDICAL_RECORD_NUMBER - too broad, "MR" prefix matches "Merge Request" in SCM contexts (e.g. "MR branches" → "MR br****es")
    'NHS_NUMBER',
    'AUSTRALIAN_MEDICARE',
    'HEALTH_PLAN_NUMBER',
    'PATIENT_ID',

    // Communications (removed EMERGENCY_CONTACT, ADDRESS_PO_BOX, ZIP_CODE_US, PHONE_US, PHONE_INTERNATIONAL - too broad, causing false positives)
    'PHONE_UK',
    'PHONE_UK_MOBILE',
    'PHONE_LINE_NUMBER',
    'ADDRESS_STREET',
    'POSTCODE_UK',

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
    // Removed CLIENT_ID - too broad, "client" is ubiquitous in code (npm packages like @scope/client-*, class names like ClientSdkOptions)
    'POLICE_REPORT_NUMBER',
    'IMMIGRATION_NUMBER',
    'COURT_REPORTER_LICENSE',
  ],
})

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
  detections: {
    total: number
    high: number
    medium: number
    low: number
  }
}

export type SanitizationResult = {
  sanitizedData: unknown
  counts: SanitizationCounts
}

export async function sanitizeDataWithCounts(
  obj: unknown
): Promise<SanitizationResult> {
  const counts: SanitizationCounts = {
    detections: { total: 0, high: 0, medium: 0, low: 0 },
  }

  const sanitizeString = async (str: string): Promise<string> => {
    let result = str

    // Apply PII and secrets detection using OpenRedaction
    const piiDetections = openRedaction.scan(str)
    if (piiDetections && piiDetections.total > 0) {
      const allDetections = [
        ...piiDetections.high,
        ...piiDetections.medium,
        ...piiDetections.low,
      ]

      // Count PII and secrets by severity and sanitize
      for (const detection of allDetections) {
        counts.detections.total++
        if (detection.severity === 'high') counts.detections.high++
        else if (detection.severity === 'medium') counts.detections.medium++
        else if (detection.severity === 'low') counts.detections.low++

        const masked = maskString(detection.value)
        result = result.replaceAll(detection.value, masked)
      }
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
