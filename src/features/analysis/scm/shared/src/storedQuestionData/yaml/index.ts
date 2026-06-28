import { noNewPrivileges } from './noNewPrivileges'
import { portAllInterfaces } from './portAllInterfaces'
import { writableFilesystemService } from './writableFilesystemService'

const vulnerabilities = {
  ['PORT_ALL_INTERFACES']: portAllInterfaces,
  ['WRITABLE_FILESYSTEM_SERVICE']: writableFilesystemService,
  ['NO_NEW_PRIVILEGES']: noNewPrivileges,
}

export default vulnerabilities
