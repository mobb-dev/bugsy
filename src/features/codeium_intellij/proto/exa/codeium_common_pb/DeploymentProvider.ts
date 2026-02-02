// Original file: exa/codeium_common_pb/codeium_common.proto

export const DeploymentProvider = {
  DEPLOYMENT_PROVIDER_UNSPECIFIED: 'DEPLOYMENT_PROVIDER_UNSPECIFIED',
  DEPLOYMENT_PROVIDER_VERCEL: 'DEPLOYMENT_PROVIDER_VERCEL',
  DEPLOYMENT_PROVIDER_NETLIFY: 'DEPLOYMENT_PROVIDER_NETLIFY',
  DEPLOYMENT_PROVIDER_CLOUDFLARE: 'DEPLOYMENT_PROVIDER_CLOUDFLARE',
} as const;

export type DeploymentProvider =
  | 'DEPLOYMENT_PROVIDER_UNSPECIFIED'
  | 0
  | 'DEPLOYMENT_PROVIDER_VERCEL'
  | 1
  | 'DEPLOYMENT_PROVIDER_NETLIFY'
  | 2
  | 'DEPLOYMENT_PROVIDER_CLOUDFLARE'
  | 3

export type DeploymentProvider__Output = typeof DeploymentProvider[keyof typeof DeploymentProvider]
