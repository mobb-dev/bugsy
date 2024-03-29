import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import Debug from 'debug'
import * as dotenv from 'dotenv'
import { z } from 'zod'

const debug = Debug('mobbdev:constants')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

export const ScmTypes = {
  Github: 'GitHub',
  Gitlab: 'GitLab',
  AzureDevOps: 'Ado',
} as const

export const SCANNERS = {
  Checkmarx: 'checkmarx',
  Codeql: 'codeql',
  Fortify: 'fortify',
  Snyk: 'snyk',
} as const

export const SupportedScannersZ = z.enum([SCANNERS.Checkmarx, SCANNERS.Snyk])
export type SupportedScanners = z.infer<typeof SupportedScannersZ>

type ScannerType = typeof SCANNERS
export type Scanner = ScannerType[keyof typeof SCANNERS]

const envVariablesSchema = z
  .object({
    WEB_APP_URL: z.string(),
    API_URL: z.string(),
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
  )} is invalid, please use one of: ${Object.values(ScmTypes).join(', ')}`,
  missingToken: `SCM token ${chalk.bold(
    '(--token)'
  )} is needed if you're adding an SCM token`,
} as const
