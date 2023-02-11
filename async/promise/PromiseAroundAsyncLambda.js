'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class HandledResolveAndRejectCallbacks extends AsyncObject {
  constructor (resolve, reject, asyncObject) {
    super(resolve, reject, asyncObject)
  }

  syncCall () {
    return (resolve, reject, result) => {
      this.resolve = resolve
      this.reject = reject
      return result
    }
  }

  onResult (result) {
    this.resolve(result)
    return result
  }

  onError (error) {
    this.reject(error)
    throw error
  }
}

class PromiseAroundAsyncLambda extends AsyncObject {
  constructor (asyncLambda) {
    super(asyncLambda)
  }

  syncCall () {
    return (asyncLambda) => {
      return new Promise((resolve, reject) => {
        new HandledResolveAndRejectCallbacks(
          resolve, reject, asyncLambda()
        ).call()
      })
    }
  }
}

module.exports = PromiseAroundAsyncLambda
