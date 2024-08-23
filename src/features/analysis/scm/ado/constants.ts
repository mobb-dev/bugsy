import { scmCloudUrl } from '../types'

export const ADO_ACCESS_TOKEN_URL =
  'https://app.vssps.visualstudio.com/oauth2/token'

export const DEFUALT_ADO_ORIGIN = scmCloudUrl.Ado

export enum AdoTokenTypeEnum {
  PAT = 'PAT',
  OAUTH = 'OAUTH',
  NONE = 'NONE',
}
