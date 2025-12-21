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
  })
})
