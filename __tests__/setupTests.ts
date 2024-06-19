import { vi } from 'vitest'

vi.mock('@mobb/bugsy/utils/dirname.ts')

vi.mock('configstore', () => {
  const Configstore = vi.fn()

  Configstore.prototype.get = vi.fn()
  Configstore.prototype.set = vi.fn()
  return { default: Configstore }
})
