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
  const broker = brokerHosts.find(
    (host) => host.realDomain.toLowerCase() === urlObj.hostname
  )

  if (broker) {
    return `https://${broker.virtualDomain}${urlObj.pathname}${urlObj.search}`
  }

  return url
}
