export const iframeWithoutSandbox = {
  iframeRestrictions: {
    content: () =>
      'Please define a comma-separated list of iframe sandbox restrictions (optional)',
    description: () =>
      `Possible values:
- allow-downloads
- allow-forms
- allow-modals
- allow-orientation-lock
- allow-pointer-lock
- allow-popups
- allow-popups-to-escape-sandbox
- allow-presentation
- allow-same-origin
- allow-scripts
- allow-storage-access-by-user-activation
- allow-top-navigation
- allow-top-navigation-by-user-activation
- allow-top-navigation-to-custom-protocols

See more info [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox).`,
    guidance: () => '',
  },
}
