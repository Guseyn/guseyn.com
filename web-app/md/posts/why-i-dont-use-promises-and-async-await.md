# Why I Don't Use Promises and Async/Await Abstractions in Node

<div class="date">9 August 2019</div>

In this article, I'll talk about **callback hell** again. But this time, I'll try to describe how I see this problem, and why I actually think that this is a problem. Also I'll explain why I think that abstractions such as **`Promise`** and **`async/await`** don't help us to structure our code in a better way. I'll demonstrate my solution that's based on ideas of declarative programming. And I'll show you why I think that declarative constructions is the only good way to write asynchronous code for big and complex applications.

Let's take a look at this silly but quite representative code, where we make a sequence of async calls. Here we try to read some content from the first file and write this content into another one.

```js
const fs = require('fs')

fs.readFile('./text1.txt', 'utf8', (err, result) => {
  if (err != null) {
    throw err
  }
 
  fs.writeFile('./text2.txt', result, (err) => {
    if (err != null) {
      throw err
    }
  })
})
```

Most people think that the main issue of using callbacks is that our code becomes more nested, so it would be difficult to read. But I think this is not complete vision on this problem.

The thing is that we use callbacks as proxies between async calls. We expose data and behaviour outside of async calls to callbacks where we do all the work: processing result with some logic, error handling, we share results that we get from callbacks as arguments for other async calls inside of these callbacks. And these results can mutate, so it becomes even more problematic to control data flow in our code. 

Also you can see duplication of the code where we check if error is null or not. So, it's really difficult to write more or less complex programs using this approach and keep your code clean, readable and maintainable.

Of course, you can structure your code somehow adding functions which group different combinations of async calls. But these functions are not so reusable, because all you do is just grouping different async calls just to make your code shorter, but you cannot do it always. Anyway, this approach is not efficient enough.

How can we solve callback-hell problem then?

Let's talk about *Promises*, which were introduced to do that. But I don't think they actually do. Let's take a look at the same logic but with using Promises. 

```js
const fs = require('fs')

const read = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, result) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const write = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err, result) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

read('./text1.txt').then((data) => {
  return write('./text2.txt', data)
}).catch((error) => {
  // handling error
})
```

Promise is just an object that has one argument, which is function with two arguments: `resolve` function and `reject` function. So, when result from async call is ready we invoke `resolve` function. And when some error occurs we invoke `reject` function. Promises make our code less nested, it's true: instead of complex callback structure we have a chain of async calls. But it does not solve other problems which I described. We still expose our data and behaviour outside of async calls to some function via `.then`. We still handle errors outside of our async calls.

I think that people who created the concept of Promises understood that, and that's why *async/await* conception was introduced as syntax sugar for Promises. And now we can rewrtite our code in this way:

```js
const fsPromises = require('fs').promises

const readFile = async (file) => {
  return fsPromises.readFile(await file, 'utf8');
}

const writeFile = async (file, content) => {
  return fsPromises.writeFile(await file, await content)
}

// handle error via .catch
writeFile('./text2.txt', readFile('./text.txt'))
.catch((err) => {
  console.log('err')
})

// handle error via try/catch
async () => {
  try {
    await writeFile('./text2.txt', readFile('./text1.txt'))
  } catch (err) {
    console.log('err')
  }
}
```

But the fact is that it made the whole situation even worse. They tried to imitate async code as synchronous code in the traditional procedural way. First, let me explain what are `async/await` keywords mean.

`async` is a keyword that says that the following function after this word is asynchronous, so it based on async calls. And `await` is used for waiting for the result from async function. And you must use `await` in async function. And the problem of this conception is that we still try to write some combinations of async calls, we are tying somehow to group them, so we can write less nested code.

But in fact we lose control of data flow. We can get a result as it is, but we have to constantly keep in mind if some calls depend on each other or not because `await` key word blocks our thread in the async function where it's used. We don't want to have something like that's called async/awit hell problem, right?

```js
async () => {
  const res1 = await fun1()
  const res2 = await fun2() 
  const res3 = await funt3()
}
```

It's a case when we invoke several async calls, which don't use each other's results. But it's kinda easy to make such mistakes whiches broke the whole idea of asynchronous programming.

Of course, you can use Promise.all() to prevent such things, but we back to using Promises, does it mean that idea and design of async/await is not efficient enough to completely avoiding Promises in our code?
And we still have the problem with error handling. Of course, we can do via standard `try/catch` mechanism in JavaScript, but I don't think that such constructions make our code easier to read and maintain.

Another big problem which I can see is noisy words: `Promise`, `async`, `await`, `.then`, `.catch`, `.all` and other things. Are they related to the business logic? Is procedural approach the best solution for solving mentioned problems? I don't think so.

Before presenting my solution, I want to show the difference between procedural and declarative programming on this simple example.

```js
const user = getUserFromDb(userId)
const account = user.createNewAccount(user, info)
user.saveAccount(account)
```

Here we just try to get some user from database, build account for this user and save it. Simple logic, and the same thing in the declarative style would look smth like this.

```js
SavedAccount(
  CreatedAccount(
    UserFromDb(userId),
    info
  )
)
```

As you can see, the main of point of such declarative style is that we hide logic inside of these objects, and we represent what we want to see as a result that our program produces. And all these objects are immutable, so we can easily test such code and control the state of these objects.

How can such declarative style help us solve callback hell problem? So, let's see.

```js
const { ReadDataByPath, WrittenFile } = require('@cuties/fs')

new WrittenFile(
  './text2.txt',
  new ReadDataByPath('./text1.txt', 'utf8')
).call()
```

This is what I propose. We can present our program as a composition or as a tree where we can declare what we want to get as a result. In this example we have two async objects `ReadDataByPath` which encapsulate function `fs.readFile`, and `WrittenFile` which encapsulates async function `fs.writeFile`. `ReadDataByPath` represents some content from file, and `WrittenFile` represents a file(or a path to the file), which has been written with some content. 

And you can notice that these objects have the same arguments in the same order that their corresponding async calls have. You might find it joyful to read such code: so, it's like we want to get file that has been written with some content that has been read from another file. I think that's the way we should write programs in general, not only in the asynchronous environments.

But the whole power of this approach you can feel when we try to get rid of callbacks. And wonderful thing about async composition is that you can put arguments like either other async object or simple objects and primitives. For example, instead of first argument in `WrittenFile` we can put another async object `ReadDataByPath` that gets the path from some 3rd file. Isn't wonderful?

Let's take a quick look at how these async objects are designed from the inside. First let's see what happens in ReadDataByPath.

```js
const { AsyncObject } = require('@cuties/cutie')
const fs = require('fs')

// Represented result is buffer or string
class ReadDataByPath extends AsyncObject {
  constructor (path, options) {
    super(path, options || {
      encoding: null,
      flag: 'r'
    });
  }

  asyncCall () {
    return fs.readFile
  }
}
```

We see here a class that extends `AsyncObject` that's provided by library [cutie](https://github.com/Guseyn/cutie). And we create a constructor with arguments: path (which can be either simple string or som other `AsyncObject`) and options object (which also can be as a simple object or some `AsyncObject` that represents options object). Also we declare here our async call, which is `fs.read`. You can encapsulate in `AsyncObject` not only async call, but sync call. And it will still be an async object as it can have async objects as arguments (it can rely on other async objects, and this is makes it async object, for more details you can use links in the references).

Now, let's take a look at `WrittenFile`. 

```js
const { AsyncObject } = require('@cuties/cutie')
const fs = require('fs')

// Represented result is file
class WrittenFile extends AsyncObject {
  constructor (file, data, options) {
    super(file, data, options || {
      encoding: 'utf8',
      mode: 0o666,
      flag: 'w'
    })
  }

  asyncCall () {
    return (file, data, options, callback) => {
      this.file = file
      fs.writeFile(file, data, options, callback)
    }
  }

  onResult () {
    return this.file
  }
}
```

It's a bit more complex, but still we have constructor where invoke super constructor with the same arguments as for `fs.writeFile` except callback, obviously. And as `fs.writeFile` does not have any result in the callback as you might remember, we define it in our custom async call which encapsulate original async call where we declare what we want to save as a result. In this case we want to save a file as a path. By the way, as I said, in the constructor we can put either async objects as arguments or simple objects and primitive. But in the declaration of our method `asyncCall()` we have ready results which we can use for our async call `fs.writeFile`. And we have method `onResult` where we can return the file which we defined here.

So, why basically this approach solves all the problems which I described?

First of all, we encapsulate logic and data in the object. Async object has methods `onResult` and `onError` which you can override and make processing result or handling error. There are other stuff you can do in the object, for example you can declare that you don't want your program to stop event if something fails, you specify if your callback has an error argument or not and a lot of other stuff which you can find in the references section.

Another thing that I want to mention you async objects work only in the context of other async object in the async composition, so your whole program would be declarative, which is in my opinion is great.

But obviously, there are some problems with this approach. First is that you have to write a lot of such declarative wrapper around static functions in Node. But I solved a bit this problem, I created a lot of libraries like [**cutie-fs**](https://github.com/Guseyn/cutie-fs), [**cutie-http**](https://github.com/Guseyn/cutie-http), [**cutie-https**](https://github.com/Guseyn/cutie-https), [**cutie-buffer**](https://github.com/Guseyn/cutie-buffer), [**cutie-json**](https://github.com/Guseyn/cutie-json), [**cutie-stream**](https://github.com/Guseyn/cutie-stream), and even [**cutie-rest**](https://github.com/Guseyn/cutie-rest). I will put link to my github account, so you can find all those libraries. 

Another thing is that people don't use to write and read such code. They think that it's too verbose and weird. But in my opinion, it's just a cultural problem, because I really feel that this is something that I want to maintain and read. I think that such code has well written structured form. 

And last but not least, it's performance. As you can imagine, in this approach we have to create a lot of objects, and it cannot be good for garbage collection and stuff like that. But in my experience, performance is not affected too much so I give up this idea and move to traditional procedural programming. And I think that it's better to have clean code instead of fast code, because it would be easier to find performance issues in the code that you can understand than in the bad structured code. And more over, I think that it's possible to create a converter that translate such declarative code into procedural code as executable file that you can run in production environment, for example.

That's pretty much it what I wanted to cover in this article. Thank you for reading. See you soon.

<div class="refs">References</div>

* [My GitHub account where you can find all libraries, which provide async objects](https://github.com/Guseyn/)
* [Cutie on GitHub](https://github.com/Guseyn/cutie)
* [Technical article about async objects](https://guseyn.com/posts/async-objects-instead-of-async-calls)
* [Async Tree Pattern](https://guseyn.com/pdf/Async_Tree_Pattern.pdf)
