export default class ServerSideError extends Error {
  constructor (...args:any[]) {
    super(...args)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerSideError)
    }
  }
}
