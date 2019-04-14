# Declarative events
<div class="date">5 April 2018</div>

<div class="tags">
  <a class="tag" href="/../tags/oop?v={version}">oop</a>
  <a class="tag" href="/../tags/node?v={version}">node</a>
  <a class="tag" href="/../tags/asyncobjects?v={version}">async objects</a>
</div>

There is another abstraction in Node that must be considered. And this is the *events*.

*[ If you didn't read [previous article](https://guseyn.com/posts/async-objects-instead-of-async-calls?v=1.0.100), I would recommend read it first before moving on. ]*

Let's look at the most popular example in Node:

```js
http.createServer((request, response) => {
    // send back a response every time you get a request
}).listen(8080, '127.0.0.1', () => {
    console.log('server is listening on 127.0.0.1:8080')
})
```

Here method `createServer` uses *request listener* as argument, which actually works like an event: on every `request` it provides a  `response`. Unlike simple async call, event is never finished and it's being invoked every time when it's needed.

It can be rewritten in the following declarative way:

```js
new LoggedListeningServer(
  new ListeningServer(
    new CreatedServer(
      new RequestResponseEvent()
    ), 8080, '127.0.0.1'
  ), 'server is listening on 127.0.0.1:8080'
).call()
```

As you can see, `RequestResponseEvent` is a node of the async tree that represents request listener, but it's not a simple argument or async object. `RequestResponseEvent` implements `Event` interface and it needs to be treated in a special way, so it requires more flexibility of the whole system. But we also can create `Event` via `AsyncObject`.

Basically, `Event` is an interface that provides only one method: `body(...args)` that must be implemented by the extended classes. The main purpose of this interface is to replace functions of events(or listeners). `Event` is not an `AsyncObject`, but it represents function of some event. But you cannot use `AsyncObject` that represents some `Event` instead of the `Event`. In that case you can use `AsyncObject` that represents some function. Actually, you can use a function in the async composition instead of `Event`, but for readability it's better to use `Event`.

```js
class Event {
  constructor () {}

  // TO BE OVERRIDDEN

  body (...args) {
    throw new Error(`Method body must be overriden with arguments ${args} of the event/eventListener you call`)
  }
}
```

<br/>
**How to create an Event**

Let's say we have a `ReadStream` and we need to be able to attach an `'open'` event to it. So, we need to create an async object `ReadStreamWithOpenEvent` that represents `ReadStream` with attached `'open'` event.

```js
// Represented result is a ReadStream
class ReadStreamWithOpenEvent extends AsyncObject {
  /*
    event is an Event with body(fd)
  */
  constructor ( readStream, event) {
    super(readStream, event)
  }

  syncCall () {
    return (readStream, event) => {
      readStream.on('open', event)
      return readStream
    }
  }
}
```

Actually `readStream` with `'open'` event has the following signature:

```js
readStream.on('open', (fd) => {
  // here we work with fd  
})
```

So, `OpenEvent` would be:

```js
class OpenEvent extends Event {
  constructor () {
    super ()
  }

  body (fd) {
    // here we work with fd
  }
}
```

As you can see `body` use the same arguments as the event of the `readStream`. 

So, in the composition it would look something like this:

```js
new ReadStreamWithOpenEvent(
  new CreatedSomeHowReadStream(), new OpenEvent()
).call()
```

The main problem of `Event` is that it cannot encapsulate async objects, because it's being replaced by corresponding function (which is actually `body()`) in a moment of construction of the async tree that contains this event. So, if you want use an event that can be constructed by async objects you can simply create  `AsyncObject` that represents a function that is the `body` of the event:

```js
class OpenEvent extends AsyncObject {
  constructor (...asyncObjects) {
    super(...asyncObjects)
  }

  syncCall () {
    return (...resultsFromAsyncObjects) => {
      // This is body of the event
      return (fd) => {
        /* now you can use here not only fd but also
            ...resultsFromAsyncObjects */
      }
    }
  }
}
```

And now the composition of objects would look something like this:

```js
new ReadStreamWithOpenEvent(
  new CreatedSomeHowReadStream(),
  new OpenEvent(
    new SomeAsyncParameter()
  )
).call()
```

**Updates:** you can create `Event` via [`Created`](https://github.com/Guseyn/cutie-created) async object, it will allow to encapsulate data from async objects inside of `Event`.

<div class="refs">References</div>

* [Cutie on GitHub](https://github.com/Guseyn/cutie)
