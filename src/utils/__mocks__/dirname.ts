import { vi } from 'vitest'

export const getDirName = vi.fn(() => 'dir')
const mock = {
  getDirName,
}

export default mock
