# Declarative Unit Testing

<div class="date">1 May 2018</div>

It's amazing how easy and joyful unit testing can be if you write code in declarative style. I've just released my new library [cutie-assert](https://github.com/Guseyn/cutie-assert). It is a [cutie](https://github.com/Guseyn/cutie) extension for **assert** module in Node. In this article, I want to show you the real power of this library.

Let's start with simple case.

```js
const { Assertion } = require('@cuties/assert')

new Assertion(true).call()
```

Here we just call `assert` function. Nothing interesting. Let's move on.

```js
const { DeepStrictEqualAssertion } = require('@cuties/assert')

new DeepStrictEqualAssertion(
  { a: 'a', b: 'b', c: 7 },
  { a: 'a', b: 'b', c: 7 }
).call()
```

`DeepStrictEqualAssertion` is a wrapper around `assert.deepStrictEqual`. So, here the first argument is actual object, and second one is expected object. As it's been said in [this article](/async-objects-instead-of-async-calls) composition of async objects can be very flexible. So, the following code also works.

```js
const { DeepStrictEqualAssertion } = require('@cuties/assert')
const { ReadDataByPath } = require('@cuties/fs')
const { ParsedJSON } = require('@cuties/json')

new DeepStrictEqualAssertion(
  new ParsedJSON(
    new ReadDataByPath(
      'file1.json',
      { encoding: 'utf8' }
    )
  ),
  new ParsedJSON(
    new ReadDataByPath(
      'file2.json',
      { encoding: 'utf8' }
    )
  )
).call()
```

Each of *file1.json* and *file2.json* contains object *{ a: 'a', b: 'b', c: 7 }*. Here we read actual and expected objects from these files, parse them as json and then we make assertion that they are equal. So, we can build very complex assertions in very elegant way.

It's amazing, isn't? What do you think?

<div class="refs">References</div>

* [cutie-assert on GitHub](https://github.com/Guseyn/cutie-assert)

<br>

[Reddit Comments](https://www.reddit.com/r/node/comments/b29vpi/declarative_unit_testing/?) / 
[HN Comments](https://news.ycombinator.com/item?id=19416508)
