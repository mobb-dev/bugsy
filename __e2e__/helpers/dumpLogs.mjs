import Configstore from 'configstore'

export const dumpLogs = (path) => {
  const mobbConfigStore = new Configstore('mobb-logs', {})
  const logs = mobbConfigStore.get(path) || []
  console.log(logs)
}
