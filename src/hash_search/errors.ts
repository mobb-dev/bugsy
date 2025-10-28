export class HashSearchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HashSearchError'
    Object.setPrototypeOf(this, HashSearchError.prototype)
  }
}
