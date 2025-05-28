import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import Debug from 'debug'
import * as dotenv from 'dotenv'
import { z } from 'zod'

import { Vulnerability_Report_Vendor_Enum } from './features/analysis/scm/generates/client_generates'
import { ScmType } from './features/analysis/scm/shared/src/types'

const debug = Debug('mobbdev:constants')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

export const scmFriendlyText: Record<ScmType, string> = {
  [ScmType.Ado]: 'Azure DevOps',
  [ScmType.Bitbucket]: 'Bitbucket',
  [ScmType.GitHub]: 'GitGub',
  [ScmType.GitLab]: 'GitLab',
}

export const SCANNERS = {
  Checkmarx: 'checkmarx',
  Codeql: 'codeql',
  Fortify: 'fortify',
  Snyk: 'snyk',
  Sonarqube: 'sonarqube',
  Semgrep: 'semgrep',
  Datadog: 'datadog',
} as const

export const scannerToVulnerabilityReportVendorEnum = {
  [SCANNERS.Checkmarx]: Vulnerability_Report_Vendor_Enum.Checkmarx,
  [SCANNERS.Snyk]: Vulnerability_Report_Vendor_Enum.Snyk,
  [SCANNERS.Sonarqube]: Vulnerability_Report_Vendor_Enum.Sonarqube,
  [SCANNERS.Codeql]: Vulnerability_Report_Vendor_Enum.Codeql,
  [SCANNERS.Fortify]: Vulnerability_Report_Vendor_Enum.Fortify,
  [SCANNERS.Semgrep]: Vulnerability_Report_Vendor_Enum.Semgrep,
  [SCANNERS.Datadog]: Vulnerability_Report_Vendor_Enum.Datadog,
} as const

export const SupportedScannersZ = z.enum([SCANNERS.Checkmarx, SCANNERS.Snyk])
export type SupportedScanners = z.infer<typeof SupportedScannersZ>

type ScannerType = typeof SCANNERS
export type Scanner = ScannerType[keyof typeof SCANNERS]

const envVariablesSchema = z
  .object({
    WEB_APP_URL: z.string(),
    API_URL: z.string(),
    HASURA_ACCESS_KEY: z.string(),
    LOCAL_GRAPHQL_ENDPOINT: z.string(),
    HTTP_PROXY: z.string().optional().default(''),
    HTTPS_PROXY: z.string().optional().default(''),
  })
  .required()

const envVariables = envVariablesSchema.parse(process.env)
debug('config %o', envVariables)

export const mobbAscii = `
                                   ..                       
                             ..........                     
                        .................                   
               ...........................                  
              ..............................                
             ................................               
             ..................................             
            ....................................            
            .....................................           
            .............................................   
          ................................................. 
     ...............................       .................
  ..................................           ............ 
..................    .............            ..........   
......... ........      .........             ......        
  ...............                          ....             
         .... ..                                            
                                                            
                                      . ...                 
                              ..............                
                       ......................               
                   ...........................              
               ................................             
           ......................................           
                ...............................             
                       .................                    
`

export const PROJECT_DEFAULT_NAME = 'My first project'
export const WEB_APP_URL = envVariables.WEB_APP_URL
export const API_URL = envVariables.API_URL
export const HASURA_ACCESS_KEY = envVariables.HASURA_ACCESS_KEY
export const LOCAL_GRAPHQL_ENDPOINT = envVariables.LOCAL_GRAPHQL_ENDPOINT
export const HTTPS_PROXY = envVariables.HTTPS_PROXY
export const HTTP_PROXY = envVariables.HTTP_PROXY

export const PROJECT_PAGE_REGEX =
  /^http:\/\/(127\.0\.0\.1)|(localhost):5173\/organization\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/project\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

export const errorMessages = {
  missingCxProjectName: `project name ${chalk.bold(
    '(--cx-project-name)'
  )} is needed if you're using checkmarx`,
  missingUrl: `url ${chalk.bold(
    '(--url)'
  )} is needed if you're adding an SCM token`,
  invalidScmType: `SCM type ${chalk.bold(
    '(--scm-type)'
  )} is invalid, please use one of: ${Object.values(ScmType).join(', ')}`,
  missingToken: `SCM token ${chalk.bold(
    '(--token)'
  )} is needed if you're adding an SCM token`,
} as const

export const progressMassages = {
  processingVulnerabilityReportSuccess:
    '⚙️  Vulnerability report proccessed successfully',
  processingVulnerabilityReport: '⚙️  Proccessing vulnerability report',
  processingVulnerabilityReportFailed:
    '⚙️  Error Proccessing vulnerability report',
} as const

export const VUL_REPORT_DIGEST_TIMEOUT_MS = 1000 * 60 * 30 // 30 minutes in msec
