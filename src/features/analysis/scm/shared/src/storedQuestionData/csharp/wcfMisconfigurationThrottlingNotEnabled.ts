export const wcfMisconfigurationThrottlingNotEnabled = {
  maxConcurrentCalls: {
    content: () => 'Please define the maximum concurrent calls',
    description: () =>
      `A positive integer that limits the number of messages that currently process across a ServiceHost. Calls in excess of the limit are queued. Setting this value to 0 is equivalent to setting it to Int32.MaxValue.`,
    guidance: () => {
      return ''
    },
  },
  maxConcurrentInstances: {
    content: () => 'Please define the maximum concurrent instances',
    description: () =>
      `A positive integer that limits the number of InstanceContext objects that execute at one time across a ServiceHost. Requests to create additional instances are queued and complete when a slot below the limit becomes available.`,
    guidance: () => {
      return ''
    },
  },
  maxConcurrentSessions: {
    content: () => 'Please define the maximum concurrent sessions',
    description: () =>
      `A positive integer that limits the number of sessions a ServiceHost object can accept.`,
    guidance: () => {
      return ''
    },
  },
}
