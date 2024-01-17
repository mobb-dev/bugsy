import sodium from 'libsodium-wrappers'

export async function encryptSecret(
  secret: string,
  key: string
): Promise<string> {
  await sodium.ready

  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  const binsec = sodium.from_string(secret)

  // Encrypt the secret using libsodium
  const encBytes = sodium.crypto_box_seal(binsec, binkey)

  // Convert the encrypted Uint8Array to Base64
  return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
}
