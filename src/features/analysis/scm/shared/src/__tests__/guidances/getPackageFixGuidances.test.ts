import { describe, expect, it } from 'vitest'

import {
  Language,
  ManifestAction,
} from '../../../../generates/client_generates'
import { getPackageFixGuidance } from '../../guidances'
import { ManifestActionRequired } from '../../types'

describe('getPackageFixGuidance', () => {
  it('should return an empty array for empty input', () => {
    expect(getPackageFixGuidance([])).toEqual([])
  })

  it('should handle JavaScript Add action', () => {
    const action: ManifestActionRequired = {
      language: Language.Js,
      action: ManifestAction.Add,
      lib: { name: 'sanitize-html', version: '1.0.0', envName: null },
      typesLib: null,
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain(
      'We use `sanitize-html` package to sanitize user input'
    )
    expect(result[0]).toContain(
      'add the latest [`sanitize-html`](https://www.npmjs.com/package/sanitize-html) to your `package.json` file'
    )
  })

  it('should handle JavaScript Add action with typesLib', () => {
    const action: ManifestActionRequired = {
      language: Language.Js,
      action: ManifestAction.Add,
      lib: { name: 'sanitize-html', version: '1.0.0', envName: null },
      typesLib: {
        name: '@types/sanitize-html',
        version: '1.0.0',
        envName: null,
      },
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain(
      'For TypeScript users, consider adding [`@types/sanitize-html`](https://www.npmjs.com/package/@types/sanitize-html) to your `package.json` as well'
    )
  })

  it('should handle JavaScript Relock action', () => {
    const action: ManifestActionRequired = {
      language: Language.Js,
      action: ManifestAction.Relock,
      lib: { name: 'some-package', version: '1.0.0', envName: null },
      typesLib: null,
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain(
      'A lock file was detected, please make sure to relock the lock file using your package manager'
    )
  })

  it('should handle JavaScript Upgrade action', () => {
    const action: ManifestActionRequired = {
      language: Language.Js,
      action: ManifestAction.Upgrade,
      lib: { name: 'lodash', version: '1.0.0', envName: null },
      typesLib: null,
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain(
      'We use `lodash` package to sanitize user input'
    )
    expect(result[0]).toContain(
      'upgrade the package [`lodash`](https://www.npmjs.com/package/lodash) to the latest version in your `package.json` file'
    )
  })

  it('should handle Java Add action', () => {
    const action: ManifestActionRequired = {
      language: Language.Java,
      action: ManifestAction.Add,
      lib: {
        name: 'org.owasp.encoder:encoder',
        version: '1.0.0',
        envName: null,
      },
      typesLib: null,
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain('We use `encoder` package in the fix')
    expect(result[0]).toContain(
      'add the latest [`encoder`](https://mvnrepository.com/artifact/org.owasp.encoder/encoder) to your pom file'
    )
  })

  it('should handle Java Upgrade action', () => {
    const action: ManifestActionRequired = {
      language: Language.Java,
      action: ManifestAction.Upgrade,
      lib: { name: 'com.google.guava:guava', version: '1.0.0', envName: null },
      typesLib: null,
    }
    const result = getPackageFixGuidance([action])
    expect(result).toHaveLength(1)
    expect(result[0]).toContain('We use `guava` package in the fix')
    expect(result[0]).toContain(
      'upgrade the package [`guava`](https://mvnrepository.com/artifact/com.google.guava/guava) to the latest version in your pom file'
    )
  })

  it('should handle multiple actions', () => {
    const actions: ManifestActionRequired[] = [
      {
        language: Language.Js,
        action: ManifestAction.Add,
        lib: { name: 'sanitize-html', version: '1.0.0', envName: null },
        typesLib: null,
      },
      {
        language: Language.Java,
        action: ManifestAction.Upgrade,
        lib: {
          name: 'org.owasp.encoder:encoder',
          version: '1.0.0',
          envName: null,
        },
        typesLib: null,
      },
    ]
    const result = getPackageFixGuidance(actions)
    expect(result).toHaveLength(2)
    expect(result[0]).toContain('sanitize-html')
    expect(result[1]).toContain('encoder')
  })

  it('should filter out undefined results', () => {
    const actions: ManifestActionRequired[] = [
      {
        language: Language.Js,
        action: ManifestAction.Add,
        lib: { name: 'sanitize-html', version: '1.0.0', envName: null },
        typesLib: null,
      },
      {
        language: 'Unknown' as Language,
        action: ManifestAction.Add,
        lib: { name: 'unknown-package', version: '1.0.0', envName: null },
        typesLib: null,
      },
    ]
    const result = getPackageFixGuidance(actions)
    expect(result).toHaveLength(1)
    expect(result[0]).toContain('sanitize-html')
  })
})
