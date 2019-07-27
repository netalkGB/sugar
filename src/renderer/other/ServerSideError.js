export default class ServerSideError extends Error {
  constructor (...args) {
    super(...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerSideError)
    }
  }
}
