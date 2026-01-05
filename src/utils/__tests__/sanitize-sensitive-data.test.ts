/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'

import { sanitizeData } from '../sanitize-sensitive-data'

describe('sanitize-sensitive-data', async () => {
  describe('sanitizeData', async () => {
    it('should mask email addresses', async () => {
      const input = 'Contact me at john.doe@example.com'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('john.doe@example.com')
      expect(result).toContain('***')
    })

    it('should mask phone numbers', async () => {
      const input = 'Call me at +1-555-123-4567'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('555-123-4567')
      expect(result).toContain('***')
    })

    it('should mask SSNs', async () => {
      const input = 'SSN: 123-45-6789'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('123-45-6789')
    })

    it('should mask credit card numbers', async () => {
      const input = 'Card: 4111 1111 1111 1111'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('4111')
    })

    it('should mask GitHub tokens', async () => {
      const input = 'Token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('ghp_1234567890abcdefghijklmnopqrstuvwxyz12')
      expect(result).toContain('gh')
      expect(result).toContain('12')
      expect(result).toContain('***')
    })

    it('should mask AWS access keys', async () => {
      const input = 'AWS Key: AKIAIOSFODNN7EXAMPLE'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE')
      expect(result).toContain('AK****************LE')
    })

    it('should mask JWT tokens', async () => {
      const input =
        'JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })

    it('should mask API keys in key-value pairs', async () => {
      const input = 'api_key: sk_live_1234567890abcdefghijklmnop'
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('sk_live_1234567890abcdefghijklmnop')
    })

    it('should handle objects with sensitive keys', async () => {
      const input = {
        username: 'john',
        password: 'secretPassword123',
        email: 'john@example.com',
        token: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz12',
      }
      const result = (await sanitizeData(input)) as any
      expect(result.username).toBe('john')
      expect(result.password).toBe('secretPassword123')
      expect(result.email).toContain('***')
      expect(result.token).toBe('gh**************************************12')
    })

    it('should handle arrays', async () => {
      const input = ['normal text', 'email@example.com', 'AKIAIOSFODNN7EXAMPLE']
      const result = (await sanitizeData(input)) as string[]
      expect(result[0]).toBe('normal text')
      expect(result[1]).toContain('***')
      expect(result[2]).not.toContain('AKIAIOSFODNN7EXAMPLE')
    })

    it('should handle nested objects', async () => {
      const input = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret123',
            apiKey: 'sk_live_1234567890abcdefgh',
          },
        },
      }
      const result = (await sanitizeData(input)) as any
      expect(result.user.name).toBe('John')
      expect(result.user.credentials.password).toBe('secret123')
      expect(result.user.credentials.apiKey).toBe('sk_live_12******90abcdefgh')
    })

    it('should preserve non-sensitive data', async () => {
      const input = 'This is normal text without any sensitive information'
      const result = (await sanitizeData(input)) as string
      expect(result).toBe(input)
    })

    it('should handle null and undefined', async () => {
      expect(await sanitizeData(null)).toBe(null)
      expect(await sanitizeData(undefined)).toBe(undefined)
    })

    it('should handle Dates and Errors', async () => {
      const date = new Date()
      const error = new Error('test error')
      expect(await sanitizeData(date)).toBe(date)
      expect(await sanitizeData(error)).toBe(error)
    })

    it('should handle multi-line strings', async () => {
      const input = `Line 1 with normal text
Line 2 with email: john@example.com
Line 3 with token: ghp_1234567890abcdefghijklmnopqrstuvwxyz12
Line 4 with normal text again`
      const result = (await sanitizeData(input)) as string
      expect(result).toContain('Line 1 with normal text')
      expect(result).not.toContain('john@example.com')
      expect(result).not.toContain('ghp_1234567890abcdefghijklmnopqrstuvwxyz12')
      expect(result).toContain('Line 4 with normal text again')
      expect(result).toContain('\n') // Ensure newlines are preserved
    })

    it('should handle multi-line private keys', async () => {
      const input = `Some text before
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnop
qrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdef
-----END RSA PRIVATE KEY-----
Some text after`
      const result = (await sanitizeData(input)) as string
      expect(result).toContain('Some text before')
      expect(result).toContain('Some text after')
      expect(result).not.toContain('MIIEpAIBAAKCAQEA1234567890')
      expect(result).toContain('***')
      // Note: The PRIVATE_KEY pattern has limitations in this OpenRedaction version,
      // but some parts should still be detected and masked
      // The test focuses on ensuring sensitive content is partially masked
    })

    it('should handle JSON with newlines', async () => {
      const input = JSON.stringify(
        {
          config: `{
  "apiKey": "sk_live_1234567890abcdefghijklmnop",
  "endpoint": "https://api.example.com",
  "debug": true
}`,
          description: 'This is a\nmulti-line\ndescription',
          token: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz12',
        },
        null,
        2
      )

      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('sk_live_1234567890abcdefghijklmnop')
      expect(result).not.toContain('ghp_1234567890abcdefghijklmnopqrstuvwxyz12')
      expect(result).toContain('https://api.example.com')
      expect(result).toContain('multi-line')
    })

    it('should preserve formatting in multi-line strings', async () => {
      const input = `
        function test() {
          const apiKey = "sk_test_1234567890abcdefghijklmnop";
          const email = "admin@company.com";
          return apiKey + email;
        }
      `
      const result = (await sanitizeData(input)) as string
      expect(result).not.toContain('sk_test_1234567890abcdefghijklmnop')
      expect(result).not.toContain('admin@company.com')
      expect(result).toContain('function test()')
      expect(result).toContain('return')
      // Check that indentation is preserved
      expect(result).toMatch(/\s+function test\(\)/)
      // Check that newlines are preserved
      const lines = result.split('\n')
      expect(lines.length).toBeGreaterThan(3)
    })
    // Regression tests for false positives (over-sanitization of legitimate code)
    it('should NOT sanitize legitimate Java programming terms', async () => {
      const javaCode = `package com.demobank.entity;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
public class MortgageProduct {
    private String name;
    private int termInYears;
    private BigDecimal interestRate;
    private BigDecimal processFee;
    private String description;
}`

      const result = (await sanitizeData(javaCode)) as string

      // These terms were previously over-sanitized but should remain intact
      expect(result).toContain('MortgageProduct') // Was flagged as LOAN_ACCOUNT
      expect(result).toContain('termInYears') // Was flagged as INSTAGRAM_USERNAME
      expect(result).toContain('interestRate') // Was flagged as INSTAGRAM_USERNAME
      expect(result).toContain('processFee') // Was flagged as INSTAGRAM_USERNAME
      expect(result).toContain('description') // Was flagged as INSTAGRAM_USERNAME
      expect(result).toContain('BigDecimal')
      expect(result).toContain('package')
      expect(result).toContain('import')
      expect(result).toContain('public')
      expect(result).toContain('private')

      // Should not contain sanitization asterisks for these legitimate terms
      expect(result).not.toContain('Pr***ct')
      expect(result).not.toContain('te*******rs')
      expect(result).not.toContain('in********te')
      expect(result).not.toContain('pr******ee')
      expect(result).not.toContain('de*******on')
    })

    it('should NOT sanitize common programming keywords', async () => {
      const programmingTerms = [
        'function',
        'class',
        'interface',
        'public',
        'private',
        'import',
        'export',
        'const',
        'let',
        'var',
        'String',
        'int',
        'boolean',
        'void',
        'service',
        'controller',
        'model',
        'repository',
        'entity',
        'config',
        'settings',
        'options',
        'parameters',
      ]

      for (const term of programmingTerms) {
        const result = (await sanitizeData(term)) as string
        expect(result).toBe(term) // Should remain unchanged
      }
    })

    it('should handle mixed legitimate code with real sensitive data', async () => {
      const mixedContent = `
        public class UserService {
            private String serviceName = "UserService";

            // This contains real sensitive data that should be sanitized
            private String adminEmail = "admin@company.com";
            private String apiKey = "sk_live_4eC39HqLyjWDarjtT1zdp7dc";
        }
      `

      const result = (await sanitizeData(mixedContent)) as string

      // Should preserve legitimate programming terms
      expect(result).toContain('UserService')
      expect(result).toContain('serviceName')
      expect(result).toContain('public')
      expect(result).toContain('private')
      expect(result).toContain('String')
      expect(result).toContain('class')

      // But should sanitize actual sensitive data
      expect(result).not.toContain('admin@company.com')
      expect(result).not.toContain('sk_live_4eC39HqLyjWDarjtT1zdp7dc')
    })

    // === COMPREHENSIVE FALSE POSITIVE TESTING ===
    describe('False Positive Detection Tests', async () => {
      it('should handle version numbers (some may be flagged as IP addresses)', async () => {
        const testCases = [
          // These should NOT be flagged (don't look like IP addresses)
          { input: 'React 18.2.0', shouldSanitize: false },
          { input: 'node version 16.14.2', shouldSanitize: false },
          { input: 'npm 8.5.0', shouldSanitize: false },
          { input: 'package.json version: "1.0.0"', shouldSanitize: false },
          { input: 'API version 2.1.3', shouldSanitize: false },

          // This one IS flagged as an IP address (acceptable false positive)
          { input: 'build 4.8.1.203', shouldSanitize: true },

          // This one is NOT flagged (IPV4 pattern doesn't match this context)
          { input: 'release 10.15.3.45', shouldSanitize: false },
        ]

        for (const testCase of testCases) {
          const result = (await sanitizeData(testCase.input)) as string

          if (testCase.shouldSanitize) {
            expect(result).not.toBe(testCase.input) // May be sanitized (acceptable)
          } else {
            expect(result).toBe(testCase.input) // Should remain unchanged
          }
        }
      })

      it('should NOT flag legitimate file paths', async () => {
        const filePaths = [
          '/usr/local/bin/node',
          'C:\\Users\\Developer\\project\\src\\index.js',
          './config/database.yml',
          '../src/components/Button.tsx',
          '/var/log/application.log',
          'home/user/.bashrc',
          'package.json',
          'node_modules/@types/react/index.d.ts',
        ]

        for (const path of filePaths) {
          const result = (await sanitizeData(path)) as string
          expect(result).toBe(path)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag legitimate URLs without credentials', async () => {
        const urls = [
          'https://api.github.com/repos/owner/repo',
          'http://localhost:3000',
          'https://www.npmjs.com/package/react',
          'https://docs.microsoft.com/en-us/azure',
          'ftp://ftp.example.com/files',
          'ws://localhost:8080/websocket',
          'https://registry.npmjs.org/@types/node',
        ]

        for (const url of urls) {
          const result = (await sanitizeData(url)) as string
          expect(result).toBe(url)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag common programming variable names', async () => {
        const variableNames = [
          'firstName',
          'lastName',
          'phoneNumber',
          'emailAddress',
          'socialSecurityNumber',
          'creditCardNumber',
          'userPassword',
          'apiKeyValue',
          'secretToken',
          'accessKey',
        ]

        for (const varName of variableNames) {
          const result = (await sanitizeData(varName)) as string
          expect(result).toBe(varName)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag UUIDs and hash values', async () => {
        const identifiers = [
          '550e8400-e29b-41d4-a716-446655440000', // UUID
          'a1b2c3d4e5f6789012345678901234567890abcd', // SHA1
          '5d41402abc4b2a76b9719d911017c592', // MD5
          'commit-hash-abc123def456',
          'session-id-xyz789',
          'request-id-12345abcde',
        ]

        for (const id of identifiers) {
          const result = (await sanitizeData(id)) as string
          expect(result).toBe(id)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag legitimate log entries', async () => {
        const logEntries = [
          '2023-01-15 10:30:45 INFO Starting application',
          'DEBUG [main] Loading configuration from /etc/app.conf',
          'ERROR 404 - Page not found at /api/users/123',
          'WARN Connection timeout after 30 seconds',
          '127.0.0.1 - - [15/Jan/2023:10:30:45] "GET /health HTTP/1.1" 200 -',
        ]

        for (const log of logEntries) {
          const result = (await sanitizeData(log)) as string
          expect(result).toBe(log)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag common configuration patterns', async () => {
        const configs = [
          'timeout: 30000', // No longer flagged (ZIP_CODE_US removed)
          'port: 8080',
          'maxConnections: 100',
          'retryAttempts: 3',
          'batchSize: 1000',
          'cacheExpiry: 3600',
          'workers: 4',
          'bufferSize: 8192',
        ]

        for (const config of configs) {
          const result = (await sanitizeData(config)) as string
          expect(result).toBe(config)
          expect(result).not.toContain('***')
        }
      })

      it('should NOT flag code with patterns that look like personal data', async () => {
        const codeSnippets = [
          'const user = { name: "placeholder", age: 25 };',
          'function getUserPhone() { return "000-000-0000"; }',
          'const mockEmail = "test@example.com";',
          'if (ssn.match(/\\d{3}-\\d{2}-\\d{4}/)) { ... }',
          'pattern = /^[0-9]{4}\\s[0-9]{4}\\s[0-9]{4}\\s[0-9]{4}$/;',
          'validate.phone = (num) => /^\\+?1?[0-9]{10}$/.test(num);',
        ]

        for (const code of codeSnippets) {
          const result = (await sanitizeData(code)) as string
          // Code should remain largely intact (some mock data might get sanitized)
          // Each code snippet should preserve its programming keywords
          if (code.includes('const')) {
            expect(result).toContain('const')
          }
          if (code.includes('function')) {
            expect(result).toContain('function')
          }
          if (code.includes('if')) {
            expect(result).toContain('if')
          }
          // Legitimate sensitive data like emails should be properly sanitized
          // We're mainly checking that programming structure isn't destroyed
          if (code.includes('test@example.com')) {
            // This email should be sanitized, so asterisks are expected
            expect(result).toContain('***')
          } else {
            // For non-sensitive code, should not have excessive asterisks
            expect(result).not.toMatch(/\*{10,}/)
          }
        }
      })

      it('should NOT flag JSON configuration without secrets', async () => {
        const jsonConfig = JSON.stringify(
          {
            database: {
              host: 'localhost',
              port: 5432,
              name: 'myapp',
              ssl: false,
            },
            server: {
              host: '0.0.0.0',
              port: 3000,
              cors: true,
            },
            logging: {
              level: 'info',
              format: 'json',
            },
          },
          null,
          2
        )

        const result = (await sanitizeData(jsonConfig)) as string
        expect(result).toContain('localhost')
        expect(result).toContain('5432')
        expect(result).toContain('myapp')
        expect(result).toContain('0.0.0.0')
        expect(result).not.toContain('***')
      })

      it('should NOT flag common documentation patterns', async () => {
        const documentation = [
          'See documentation at https://docs.example.com',
          'Install with: npm install @types/node',
          'Run tests: npm test',
          'Build: npm run build',
          'Example: curl -X GET http://localhost:3000/api/health',
          'Configuration file: ~/.app/config.yml',
          'Default port: 8080',
        ]

        for (const doc of documentation) {
          const result = (await sanitizeData(doc)) as string
          expect(result).toBe(doc)
          expect(result).not.toContain('***')
        }
      })
    })

    // === SIMPLE PATTERN VERIFICATION ===
    describe('Pattern Verification', () => {
      it('COMPREHENSIVE FALSE POSITIVE ANALYSIS - Show all problematic patterns', async () => {
        console.log(
          '\n🔍 COMPREHENSIVE FALSE POSITIVE ANALYSIS WITH ALL PATTERNS:\n'
        )

        const testCategories = {
          'Common Programming Variables': [
            'const userEmail = getEmail()',
            'String adminEmail',
            'function validateEmail()',
            'EmailService.send()',
            'const creditCardNumber = "4111111111111111"',
            'CreditCardValidator.validate()',
            'const secretKey = getKey()',
            'SecretManager.load()',
            'const apiKey = config.API_KEY',
            'ApiKeyManager.validate()',
            'const clientId = "myapp"',
            'CLIENT_ID = process.env.CLIENT_ID',
            'bearerToken = extractToken()',
            'BearerTokenValidator.check()',
          ],

          'Configuration Values': [
            'timeout: 30000',
            'port: 8080',
            'maxConnections: 100',
            'retryAttempts: 3',
            'bufferSize: 8192',
            'client_id: "myapp123"',
            'emergency_contact: "admin"',
            'patient_id: 12345',
            'prescription_number: "RX001"',
          ],

          'Version Numbers and Build Info': [
            'version: 4.8.1.203',
            'build 10.15.3.45',
            'release 192.168.1.1',
            'npm version 1.2.3.4',
            'API version 2023.01.15',
          ],

          'Code Documentation': [
            'Example: user@example.com for testing',
            'Default admin email: admin@localhost',
            'Use client_id from your OAuth app',
            'Set emergency_contact in config',
            'The patient_id should be numeric',
          ],

          'Log Entries': [
            'INFO: Processing client_id abc123',
            'DEBUG: Emergency contact set to admin',
            'ERROR: Invalid patient_id format',
            'WARN: Prescription number missing',
            'ACCESS: User with client_id logged in',
          ],

          'Test Data and Mocks': [
            'mockEmail = "test@example.com"',
            'const TEST_CLIENT_ID = "test123"',
            'emergency_contact: "Test User"',
            'patient_id: 999999',
            'prescription_number: "TEST-RX-001"',
          ],

          'Crypto & Hash-like Patterns': [
            'commit_hash = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"', // Might look like Bitcoin
            'session_id = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"', // Might look like crypto
            'const cardanoAddr = "addr1qx2fxv2umyht"', // Variable name with crypto term
            'litecoin_wallet = "LTC123"', // Variable name
            'solana_address = getAddress()', // Variable name
            'monero_tx = "4A4B..."', // Variable name
            'ripple_payment = "rXXX"', // Variable name
          ],

          'Financial Code Patterns': [
            'const swiftCode = "ABCDUS33"', // Variable name
            'SWIFT_BIC = process.env.SWIFT', // Variable name
            'card_track_data = "track1"', // Variable name
            'const cardExpiry = "12/25"', // Date that might look like expiry
            'card_auth_code = "123"', // Variable name
            'payment_token = generateToken()', // Variable name
          ],

          'Medical/Healthcare Patterns': [
            'health_plan_number = "HP123"', // Variable name
            'const prescriptionId = "RX-001"', // Variable name
            'PATIENT_ID = getPatientId()', // Variable name
            'health_plan: "BCBS123"', // Config value
            'prescription_num: "P123456"', // Config value
            'patient_id: 987654', // Config value (might match PATIENT_ID pattern)
          ],

          'Communication Patterns': [
            'phone_international = "+1234567890"', // Variable name
            'PHONE_LINE_NUMBER = "555-0123"', // Variable name
            'emergency_contact = "John Doe"', // Config value (might match pattern)
            'po_box = "PO Box 123"', // Config value (might match ADDRESS_PO_BOX)
            'address_po_box = getPOBox()', // Variable name
          ],

          'Platform API Keys & Tokens': [
            'slack_token = getToken()', // Variable name
            'FIREBASE_API_KEY = config.key', // Variable name
            'heroku_api_key = process.env.HEROKU', // Variable name
            'mailgun_key = "mg-key-123"', // Variable name (might match pattern)
            'sendgrid_api = "SG.123abc"', // Variable name (might match pattern)
            'twilio_key = "AC123"', // Variable name (might match pattern)
            'pypi_token = "pypi-123"', // Variable name (might match pattern)
            'kubernetes_secret = "k8s-secret"', // Variable name (might match pattern)
            'azure_storage_key = getKey()', // Variable name
            'gcp_service_account = "service@project"', // Variable name (might match pattern)
            'oauth_token = "oauth123"', // Variable name (might match pattern)
            'oauth_client_secret = getSecret()', // Variable name
          ],

          'Government/Legal Patterns': [
            'police_report_number = "PR-123"', // Variable name (might match pattern)
            'POLICE_REPORT = process.env.REPORT', // Variable name
            'immigration_number = "I-123"', // Variable name (might match pattern)
            'court_license = "CL-456"', // Variable name (might match pattern)
            'CLIENT_ID = "app-client-123"', // Config value (might match CLIENT_ID pattern)
            'client_id: "myapp-client"', // Config value (might match CLIENT_ID pattern)
          ],

          'ZIP Codes & Address Patterns': [
            'zip_code: 90210', // Config value (ZIP_CODE_US pattern)
            'ZIP_CODE_US = "10001"', // Variable name with ZIP in quotes
            'postal_code = 12345', // Config value (might match ZIP_CODE_US)
            'const zipCode = getZip()', // Variable name
          ],
        }

        for (const [category, testCases] of Object.entries(testCategories)) {
          console.log(`\n=== ${category.toUpperCase()} ===`)

          for (const testCase of testCases) {
            const { sanitizeDataWithCounts } =
              await import('../sanitize-sensitive-data')
            const result = await sanitizeDataWithCounts(testCase)
            const hasDetections = result.counts.detections.total > 0

            console.log(`\nInput: "${testCase}"`)
            console.log(`Result: "${result.sanitizedData}"`)
            console.log(`False Positive: ${hasDetections ? '❌ YES' : '✅ NO'}`)

            if (hasDetections) {
              console.log(
                `  📊 PII & Secrets Detections: ${result.counts.detections.total} (H:${result.counts.detections.high} M:${result.counts.detections.medium} L:${result.counts.detections.low})`
              )

              // Get exact patterns that matched using our same configuration
              const { OpenRedaction } =
                await import('@openredaction/openredaction')
              const tempOpenRedaction = new OpenRedaction({
                patterns: [
                  // Use same patterns as our main config (with problematic patterns removed)
                  'EMAIL',
                  'SSN',
                  'NATIONAL_INSURANCE_UK',
                  'DATE_OF_BIRTH',
                  'PASSPORT_UK',
                  'PASSPORT_US',
                  'PASSPORT_MRZ_TD1',
                  'PASSPORT_MRZ_TD3',
                  'DRIVING_LICENSE_UK',
                  'DRIVING_LICENSE_US',
                  'VISA_NUMBER',
                  'VISA_MRZ',
                  'TAX_ID',
                  'CREDIT_CARD',
                  'IBAN',
                  'BANK_ACCOUNT_UK',
                  'ROUTING_NUMBER_US',
                  'CARD_TRACK1_DATA',
                  'CARD_TRACK2_DATA',
                  'CARD_EXPIRY',
                  'CARD_AUTH_CODE',
                  'ETHEREUM_ADDRESS',
                  'LITECOIN_ADDRESS',
                  'CARDANO_ADDRESS',
                  'SOLANA_ADDRESS',
                  'MONERO_ADDRESS',
                  'RIPPLE_ADDRESS',
                  'NHS_NUMBER',
                  'MEDICAL_RECORD_NUMBER',
                  'AUSTRALIAN_MEDICARE',
                  'HEALTH_PLAN_NUMBER',
                  'PATIENT_ID',
                  'PHONE_US',
                  'PHONE_UK',
                  'PHONE_UK_MOBILE',
                  'PHONE_INTERNATIONAL',
                  'PHONE_LINE_NUMBER',
                  'ADDRESS_STREET',
                  'POSTCODE_UK',
                  'IPV4',
                  'IPV6',
                  'MAC_ADDRESS',
                  'URL_WITH_AUTH',
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
                  'POLICE_REPORT_NUMBER',
                  'IMMIGRATION_NUMBER',
                  'COURT_REPORTER_LICENSE',
                  'CLIENT_ID',
                  // Removed problematic patterns: SWIFT_BIC, BITCOIN_ADDRESS, PRESCRIPTION_NUMBER,
                  // EMERGENCY_CONTACT, ADDRESS_PO_BOX, ZIP_CODE_US
                ],
              })

              const piiDetections = tempOpenRedaction.scan(testCase)
              const allDetections = [
                ...piiDetections.high,
                ...piiDetections.medium,
                ...piiDetections.low,
              ]

              if (allDetections.length > 0) {
                console.log(`  🎯 Exact patterns matched:`)
                for (const detection of allDetections) {
                  console.log(
                    `    - "${detection.value}" → ${detection.type} (${detection.severity})`
                  )
                }
              }
            }
          }
        }
      })
    })
  })
})
