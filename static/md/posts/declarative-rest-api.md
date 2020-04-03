# Declarative REST API

<div class="date">16 June 2018</div>

<div class="tags">
  <a class="tag" href="/../tags/library?v={version}">library</a>
  <a class="tag" href="/../tags/node?v={version}">node</a>
  <a class="tag" href="/../tags/asyncobjects?v={version}">async objects</a>
</div>

We all are used to MVC for building REST applications. In this article, I'll show how you can build REST API using declarative approach. It'll be demonstrated on my library **[cutie-rest](https://github.com/Guseyn/cutie-rest)** which was released recently.

Let's start with interface `Endpoint` and some default built-in implementations of this interface that this library provides.

### `Endpoint(regexpUrl, method(string)[, ...args])`

This interface declares an endpoint (in api) with `url` that matches `regexpUrl` and specified `method` (`'GET'`, `'POST'`, etc.) in arguments of constructor. Also it's possible to pass some custom arguments via `...args`. This class has a method `body(request, response[, ...args])` that needs to be overridden and must return async object.

It's important to mention that `Endpoint` is not an `AsyncObject`. And that's how you can implement it:

```js

const { Endpoint } = require('@cuties/rest')
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require('@cuties/http')

class CustomEndpoint extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'Ok'
          ),
          'Content-Type', 'text/plain'
        ),
        'Index.'
      )
    )
  }
}
```

To handle `request` and `response` in the method `body` you can use [cutie-http](https://github.com/Guseyn/cutie-http).

### `NotFoundEndpoint(regexpUrl)`

This interface (or abstract class) extends `Endpoint`, and it declares endpoint on **`404(NOT_FOUND)`** status. 

And that's how it's implemented:

```js

const { Endpoint } = require('@cuties/rest')
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require('@cuties/http')

class NotFoundEndpoint extends Endpoint {
  constructor (regexpUrl) {
    super(regexpUrl, 'GET')
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 404), 'Not found'
          ),
          'Content-Type', 'text/plain'
        ),
        '404: Not found'
      )
    )
  }
}
```

You can create your custom variation of `Endpoint`. Just extends this default class with redefined method `body`.

### `IndexEndpoint()`

It's an `Endpoint` that is used for representing index page.

```js
const { Endpoint } = require('@cuties/rest')
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require('@cuties/http')

class IndexEndpoint extends Endpoint {
  constructor () {
    super(new RegExp(/^(\/|)$/), 'GET')
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'Ok'
          ),
          'Content-Type', 'text/plain'
        ),
        'Index.'
      )
    )
  }
}
```

### `InternalServerErrorEndpoint(regexpUrl)`

It's an `Endpoint` that is used for handling underlying internal failure(not for user error) with status code **`500`**.

```js
const { Endpoint } = require('@cuties/rest')
const {
  ResponseWithHeader,
  ResponseWithStatusCode,
  ResponseWithStatusMessage,
  WrittenResponse,
  EndedResponse
} = require('@cuties/http')

class InternalServerErrorEndpoint extends Endpoint {
  constructor (regexpUrl) {
    super(regexpUrl || new RegExp(/^\/internal-server-error/))
  }

  body (request, response, error) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 500), 'Internal Server Error'
          ),
          'Content-Type', 'text/plain'
        ),
        `500: Internal Server Error, \n${error}`
      )
    )
  }
}
```

Here method `body` also handles an `error`.

Now let's talk about other objects that REST API declaration consists of: `Backend`, `RestApi`, `RequestBody`, `CreatedServingFilesEndpoint`, `CreatedCachedServingFilesEndpoint`, `ServingFiles`, and `CachedServingFiles`.

Let's take a look on a simple declaration of REST API.

```js
const {
  Backend,
  RestApi,
  CreatedServingFilesEndpoint,
  CreatedCachedServingFilesEndpoint
} = require('@cuties/rest');
const path = require('path')
const SimpleResponseOnGETRequest = require('./SimpleResponseOnGETRequest')
const SimpleResponseOnPOSTRequest = require('./SimpleResponseOnPOSTRequest')
const CustomNotFoundEndpoint = require('./CustomNotFoundEndpoint')
const CustomInternalServerErrorEndpoint = require('./CustomInternalServerErrorEndpoint')
const CustomIndexEndpoint = require('./example/CustomIndexEndpoint')
const notFoundEndpoint = new CustomNotFoundEndpoint(new RegExp(/\/not-found/))
const internalServerErrorEndpoint = new CustomInternalServerErrorEndpoint(new RegExp(/^\/internal-server-error/))

const mapper = (url) => {
  let parts = url.split('/').filter(part => part !== '')
  return path.join(...parts)
}

const cacheMapper = (url) => {
  let parts = url.split('/').filter(part => part !== '').slice(1)
  parts.unshift('files')
  return path.join(...parts)
}

new Backend(
  'http', 
  8000, 
  '127.0.0.1',
  new RestApi(
    new CustomIndexEndpoint(),
    new SimpleResponseOnGETRequest(new RegExp(/^\/get/), 'GET'),
    new SimpleResponseOnPOSTRequest(new RegExp(/^\/post/), 'POST'),
    new CreatedServingFilesEndpoint(new RegExp(/^\/files/), mapper, {}, notFoundEndpoint),
    new CreatedCachedServingFilesEndpoint(new RegExp(/^\/cached/), cacheMapper, {}, notFoundEndpoint),
    notFoundEndpoint,
    internalServerErrorEndpoint
  )
).call()
```

### `Backend(protocol, port, host, api[, options])`

It's an `AsyncObject`. It declares a backend server with `protocol` (*http* or *https*) on specified `port` and `host`, also it provides declared `api`, `options` of the *http/https* server (it's optional).

### `RestApi(...endpoints)`

Represents request-response listener. Declares endpoints of api.

### `RequestBody(request)`

Reads body of request in `body(request, response)` method of `Endpoint` implementation.

### `ServingFilesEndpoint(regexpUrl, mapper, headers, notFoundEndpoint)`

Extends `Endpoint` and serves files on url that mathes `regexpUrl` with `mapper` function that gets location of a file on a disk by the url of incoming request. Also it's required to declare `notFoundEndpoint` that handles the cases when a file is not found. You also can specify headers in response(no need to specify the `'Content-Type'`, library makes it for you).

### `CachedServingFilesEndpoint(regexpUrl, mapper, headers, notFoundEndpoint)`

Does the same that `ServingFilesEndpoint` does and caches files for increasing speed of serving them.

### `CreatedServingFilesEndpoint(regexpUrl, mapper, headers, notFoundEndpoint)`

It's an `AsyncObject` that represents `ServingFilesEndpoint`. So, you can use its arguments as async objects.

### `CreatedServingFilesEndpoint(regexpUrl, mapper, headers, notFoundEndpoint)`

It's an `AsyncObject` that represents `CachedServingFilesEndpoint`. So, you can use its arguments as async objects.

Let's see now how `CustomIndexEndpoint`, `CustomNotFoundEndpoint`, `SimpleResponseOnGETRequest`, `SimpleResponseOnPOSTRequest` and `CustomInternalServerErrorEndpoint` are implemented.

```js
class CustomIndexEndpoint extends IndexEndpoint {
  constructor () {
    super()
  }

  body (request, response) {
    return super.body(request, response)
  }
}
```

```js
class CustomNotFoundEndpoint extends NotFoundEndpoint {
  constructor (regexpUrl) {
    super(regexpUrl)
  }

  body (request, response) {
    return super.body(request, response)
  }
}
```

```js
class SimpleResponseOnGETRequest extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithWrittenHead(
          response, 200, 'ok', {
            'Content-Type': 'text/plain'
          }
        ), 'content'
      ), ' is delivered'
    )
  }
}
```

```js
class SimpleResponseOnPOSTRequest extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    // request also contains body(as buffer), use RequestBody object for that
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithWrittenHead(
          response, 200, 'ok', {
            'Content-Type': 'text/plain'
          }
        ), new RequestBody(request)
      ), ' is delivered'
    )
  }
}
```

```js
class CustomInternalServerErrorEndpoint extends InternalServerErrorEndpoint {
  constructor (regexpUrl) {
    super(regexpUrl)
  }

  body (request, response, error) {
    return super.body(request, response, error)
  }
}
```

So, here is some examples of requests:

```bash

curl http://127.0.0.1:8000/
# Index.

curl http://127.0.0.1:8000/get
# content is delivered

curl -X POST  http://127.0.0.1:8000/post -d "content"
# content is delivered

curl http://127.0.0.1:8000/bad-url
# 404: Not found

```

<div class="refs">References</div>

* [cutie-rest on GitHub](https://github.com/Guseyn/cutie-rest)

