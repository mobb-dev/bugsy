/**
 * Does this broker front that URL?
 *
 * `hostname` *and* `host`, because a server enrolled on a non-default port is
 * stored as `git.acme:8443` — which never equalled a bare hostname, so the
 * connection enrolled, reported a live broker, and then routed every request
 * around the tunnel. Compared case-insensitively; hostnames are.
 */
function matchesRealDomain(realDomain: string, url: URL): boolean {
  const real = realDomain.trim().toLowerCase()
  return real === url.hostname.toLowerCase() || real === url.host.toLowerCase()
}

export function getBrokerEffectiveUrl({
  url,
  brokerHosts,
}: {
  url: string
  brokerHosts?: { virtualDomain: string; realDomain: string }[]
}) {
  if (!brokerHosts || brokerHosts.length === 0) {
    return url
  }

  const urlObj = new URL(url)
  const broker = brokerHosts.find((host) =>
    matchesRealDomain(host.realDomain, urlObj)
  )

  if (broker) {
    return `https://${broker.virtualDomain}${urlObj.pathname}${urlObj.search}`
  }

  return url
}
