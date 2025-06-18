export const safeBody = (body: string, maxBodyLength: number): string => {
  const truncationNotice = '\n\n... Message was cut here because it is too long'
  const maxBodyContentLength = maxBodyLength - truncationNotice.length

  return body.length > maxBodyLength
    ? body.slice(0, maxBodyContentLength) + truncationNotice
    : body
}
