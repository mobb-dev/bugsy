import { IssueType_Enum } from '../../../../generates/client_generates'
import { noNewPrivileges } from './noNewPrivileges'
import { portAllInterfaces } from './portAllInterfaces'
import { writableFilesystemService } from './writableFilesystemService'

const vulnerabilities = {
  [IssueType_Enum.PortAllInterfaces as string]: portAllInterfaces,
  [IssueType_Enum.WritableFilesystemService as string]:
    writableFilesystemService,
  [IssueType_Enum.NoNewPrivileges as string]: noNewPrivileges,
}

export default vulnerabilities
