type PromiseResolve<T> = (value: T | PromiseLike<T>) => void
type PromiseReject = (reason?: unknown) => void

export type Deferred<T> = {
  promise: Promise<T>
  resolve: PromiseResolve<T>
  reject: PromiseReject
}

type CreateDeferredParams = {
  /**
   * Ignore unhandled rejections. Defaults to `false`
   *
   * By default, Node.js fails with an `UnhandledPromiseRejection` if no one catches a promise.
   * This flag adds a catch handler that does nothing, so that the promise is not considered unhandled.
   */
  ignoreUnhandledRejection?: boolean
}

/**
 * Create a deferred. A deferred is basically a promise resolvable from outside of its handler.
 */
export function createDeferred<T>({ ignoreUnhandledRejection = false }: CreateDeferredParams = {}): Deferred<T> {
  let resolve: PromiseResolve<T> | undefined
  let reject: PromiseReject | undefined

  const promise = new Promise<T>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })

  // The promise executor is called right away (seen in the ECMA spec),
  // so we know that resolve and reject are set. This is only to make ts happy.
  // (https://262.ecma-international.org/6.0/#sec-promise-executor - point 9.)
  if (!resolve || !reject) throw new Error('Promise executor was not called')

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (ignoreUnhandledRejection) promise.catch(() => {})

  return {
    promise,
    resolve,
    reject,
  }
}