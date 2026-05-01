export const improperCertificateValidation = {
  guidance:
    () => `This fix re-enables TLS certificate validation by changing \`verify=False\` to \`verify=True\` on the HTTP request. Any call that was deliberately reaching a server with a self-signed, expired, or otherwise untrusted certificate will start raising \`ssl.SSLError\` / \`requests.exceptions.SSLError\` after this change.
\n&nbsp;
\n***Before merging, confirm that every endpoint reached by this call presents a certificate signed by a trusted CA.*** If the call must talk to an internal service that uses a private CA, prefer pointing \`verify\` at the CA bundle (\`verify="/path/to/ca.pem"\`) over disabling validation. If the certificate cannot be trusted at all, the safe fix is to terminate that connection at a properly configured proxy, not to keep it unvalidated.
\n&nbsp;
\nSee the [\`requests\` SSL verification docs](https://requests.readthedocs.io/en/latest/user/advanced/#ssl-cert-verification) for the supported \`verify\` values.`,
}
