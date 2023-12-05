# Async Objects Instead of Async Calls
<div class="date">26 January 2018</div>

In this article, I'll try to introduce the idea of **async objects** and show how they can help us to get rid of the main problem in asynchronous environment... Of course, I am talking about **callbacks**.

Every library or driver in Node.js has <b>async calls</b>, and all them have similar signature:

```js
module.asyncCall(...args, (err, result) => {
  if (err != null) {
    // everything is ok, we can use result here
  } else {
    // handle error
  }
})
```
Usually `module` is just a storage of static methods, and `asyncCall` is one of them. Besides the arguments `asyncCall` provides a callback that is being invoked when result is ready or some error comes up. The static methods is not something that we want to see in our object-oriented code.

So, how can we rewrite it in object-oriented style?

I think, the main question needs to be answered is "What is the main point of doing async call?" Well, it's simple: receive a result from an I/O operation or just handle an error in case if something fails. That means that we can represent an I/O call as a result that can be received in the future, and when it's ready it can be used as an argument for another async call.

Let's say we want to read content from a file and write it to another one. And all these operations are asynchronous, of course.

So, instead of writing something like this:

```js
fs.readFile('./../file1.txt', 'utf8', (err, result) => {
  if (err != null) {
    throw err;
  }
  fs.writeFile('/../file2.txt', result, (err) => {  
    if (err != null) {
      throw err
    }
  })
})
```

we can design our code in the following style:

```js
new WrittenFile(
  './../file2.txt',
  new ReadDataByPath('./../file1.txt', 'utf8')
).call()
```
Objects `WrittenFile` and `ReadDataByPath` are async objects, and they have the same arguments that their corresponding async calls have, except callbacks. So, here the first argument of `WrittenFile` is a path of a file we want to write content to, and the second one is the content we want to write. And as you noticed, second argument is represented here as `ReadDataByPath`. It means that method `call` of `WrittenFile` invoke first `ReadDataByPath` and use its result as content for `WrittenFile`.

It's good, but it could be better. For making this declarative abstraction flexible we need a possibility to use either ready results or async objects as arguments of composition.

For example, we can use second argument of `WrittenFile` as a string:

```js
new WrittenFile('./../file2.txt', 'content to write').call()
```

or use the fist argument as something that has been read from another file:

```js
/* here file3.txt contains information
    for the first argument of WrittenFile: './../file2.txt' */
new WrittenFile(
  new ReadDataByPath('./../file3.txt', 'utf8'),
  new ReadDataByPath('./../file1.txt', 'utf8')
).call()
```

or even just use every async object independently:

```js
new ReadDataByPath('./../file.txt', 'utf8').call()
```

It's very cute, isn't? But it's quite not easy to implement. Well, at least to me: it took 3 days or something for consideration how to do everything properly.

However the solution is quite simple. All we need is just to convert a composition of async objects to "asynchronous tree" and make tree traversal from its leaves to the root.

So, let's say we have following composition of async objects:

```js
//Pseudocode
A1 (
  A2 (
    a1, a2
  ),
  A3 (
    a3, A4(
      a4, a5
    )
  ),
  A5()
)
```

where `A1, A2, A3, A4, A5` are async objects and `a1, a2, a3, a4, a5` are just simple arguments. Then corresponding async tree for this composition would be:
![Async Tree Patter](https://github.com/Guseyn/async-tree-patern/blob/master/async-tree.png?raw=true)
Every node has child nodes as their arguments. So, `a1, a2, a3, a4, a5, A5` are leaves of the tree and they are being called first at the same time. When their results are recieved, their parents will be ready to be invoked (`a1, a2, a3, a4, a5` are already ready in that case, so we just add them to the arguments of their parent). `A1` is root of the tree, so we invoke it last. `A2` never waits for result of `A3` or `A4`, beacuse `A2` just does not need them. But `A3` waits for result of `A4`, and `A1` waits for results of `A2, A3, A5`.

Then the sequence of the calls is

```js
1. a1, a2, a3, a4, a5, A5 // at the same time
2. A2, A4 // at the same time
3. A3
4. A1

```

You might ask *"What if I need to use the result that is represented by `A1`, how can I do that?"*. Well, it's very simple: you just wrap it with another async object that processes `A1` and invokes method `call` of new async object instead of `A1`.

It means that it's not possible to combine this approach with callbacks, Promises and async/await abstractions. Mostly because all these abstractions are procedural, and async object that described above is pure object-oriented abstraction.

So, I've created open source library [cutie](https://github.com/Guseyn/cutie) that provides `AsyncObject` abstraction. It helps to build and use such compositions.

You can download it via npm:

```bash
npm install @cuties/cutie
```

Let's see how `WrittenFile` and `ReadDataByPath` could be desinged using this library:

```js
const AsyncObject = require('@cuties/cutie').AsyncObject
const fs = require('fs')

// Represents file as path
class WrittenFile extends AsyncObject {
  constructor (path, content) {
    super(path, content)
  }

  asyncCall () {
    return (path, content, callback) => {
      this.path = path
      fs.writeFile(path, content, callback)
    }
  }

  onResult() {
    return this.path
  }
}
```

```js
const AsyncObject = require('@cuties/cutie').AsyncObject
const fs = require('fs')

// Represents buffer or string
class ReadDataByPath extends AsyncObject {
  constructor (path, encoding) {
    super(path, encoding);
  }

  asyncCall () {
    return fs.readFile
  }
}
```

AsyncObject also provides methods `OnResult` and `OnError`, so that you can process the result (it's provided by callback by default) from async call and handle an error in the specific way (error is being thrown by default).

Let's say we want to read a json file and parse all information from there. **Cutie** provides two ways. First of them is just to create `ParsedJSON` async object like this:

```js
const AsyncObject = require('@cuties/cutie').AsyncObject;
const fs = require('fs');

class ParsedJSON extends AsyncObject {
  constructor (path, encoding) {
    super(path, encoding)
  }

  asyncCall () {
    return fs.readFile
  }

  onResult (result) {
    return JSON.parse(result)
  }
}

// usage
new ParsedJSON('./../file.txt', 'utf8').call()
```

`ParsedJSON` also could be designed like this:

```js
const fs = require('fs')
const ReadDataByPath = require('./ReadDataByPath')

class ParsedJSON extends ReadDataByPath {
  constructor (path, encoding) {
    super(path, encoding)
  }

  onResult (result) {
    return JSON.parse(result)
  }
}

// usage
new ParsedJSON('./../file.txt', 'utf8').call()
```

Or you can use ReadDataByPath with ParsedJSON that looks like this:

```js
const AsyncObject = require('@cuties/cutie').AsyncObject
const fs = require('fs')
const ReadDataByPath = require('./ReadDataByPath')

class ParsedJSON extends AsyncObject {
  constructor (text) {
    super(text)
  }

  /*
    you can't call here async operations with I/O
  */
  syncCall () {
    return JSON.parse
  }
}

// usage
new ParsedJSON(
  new ReadDataByPath('./../file.txt', 'utf8')
).call()
```

I've called this conception **Async Tree Pattern**. You can read more about it and [cutie](https://github.com/Guseyn/cutie) in [this doc](/../../pdf/Async_Tree_Pattern.pdf).

There is a lot of work to do, because **Cutie** is just basic library that provides `AsyncObject` abstraction. So, my goal is now to make abstractions for most async calls in Node. For example, async objects for **fs** and **http** modules for beginning would be great. If you liked this idea, you can also transform Node's static async methods into the beautiful async objects.

So, that's it. I do hope you enjoyed reading this article.

<div class="refs">References</div>

* [Cutie on GitHub](https://github.com/Guseyn/cutie)
* [Cutie on npm](https://www.npmjs.com/package/@cuties/cutie)

<br>

[Reddit Comments](https://www.reddit.com/r/javascript/comments/azy7pb/async_objects_instead_of_async_calls/) /
[HN Comments](https://news.ycombinator.com/item?id=19361241)
[Medium Comments](https://medium.com/@guseynism/async-objects-instead-of-async-calls-ccdd3046b1e2)
