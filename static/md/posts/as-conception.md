# *As* Conception In Async Tree
<div class="date">6 May 2018</div>

<div class="tags">
  <a class="tag" href="/../tags/oop?v={version}">oop</a>
  <a class="tag" href="/../tags/node?v={version}">node</a>
  <a class="tag" href="/../tags/asyncobjects?v={version}">async objects</a>
</div>

<div class="quote">
  <div class="quote-text">
    &ldquo;&nbsp;&nbsp;There are only two hard things in Computer Science: cache invalidation and naming things.&nbsp;&nbsp;&rdquo;
  </div>
  <div class="quote-author">
    Phil Karlton
  </div>
</div>

If you don't know what **async tree** is, you definitely should take a look at [this](https://github.com/Guseyn/cutie). So in short, it's a beautiful abstraction the main idea of which is to make our code declarative in asynchronous environment. So, assuming that you know (or just acquainted with) this conception, I want to describe how managing of cache could be implemented for this abstraction.

Consider the following example with *async tree*:

```js
new SavedNewAccountOfUser(
  new RetrievedUser(userId),
  new RetrievedOldAccountOfUser(
    new RetrievedUser(userId)
  )
).call()
```

So, here we try to save new account for user that based (somehow) on its old one. And as you can see, we *retrieve user* here twice. `RetrievedUser` can be a quite expensive operation, so we don't want to do it more than one time. So, what would do you do here?

Well, you definitely don't want to do something like this:

```js
const retrievedUser = new RetrievedUser(userId);
new SavedNewAccountOfUser(
  retrievedUser,
  new RetrievedOldAccountOfUser(
    retrievedUser
  )
).call()
```
Because it does not change anything. All these objects are asynchronous, they are not simple procedures, and all them will be invoked only when they are needed in the <i>async tree</i>. It means that the results they produce could be recieved and used only in the inner scope of the <i>tree</i>.

Another thing you must consider here is which of two `RetrievedUser` will be invoked first, so that you can write its result into the cache for using it for the second `RetrievedUser`.

I suggest the following approach, which I called ***As*** conception.

```js
new RetrievedUser(userId).as('user').after(
  new SavedNewAccountOfUser(
    as('user'),
    new RetrievedOldAccountOfUser(
      as('user')
    )
  )
).call()
```
Every async object can has `as(key)` method, which says to the async object that it must save its represented value(result) into the cache with the specified `key`. If `as(key)` method is used as independent(separate) function, it returns `AsyncObject`, which represents value from the cache with the specified `key`. And you can use this scheme not only for caching.
At the moment, I am working on tests for *[cutie-fs](https://github.com/Guseyn/cutie-fs)*, and sometimes I need to clean up environment after tests have passed. For example,

```js
new EqualAssertion(
  new ReadLinkByPath(
    new SymLinkedFile(
      new WrittenFile(file, data),
      linkedFile
    ) 
  ), file
).after(
  new UnlinkedFile(
    linkedFile
  )
).call()
```
Here I remove a link of file after test that created it, so it's able to create a link with the same name again in next execution of the test (you cannot create a link, if it already exists).

Method `after` can be used only once for every async tree. So, if you want to create a sequence of async trees you have to follow this rule:

```js
// RIGHT WAY, pseudocode
AsyncTree1().after(
  AsyncTree2().after(
    AsyncTree3().after(...)
  )
)

// WRONG WAY, pseudocode
AsyncTree1().after(
  AsyncTree2()
).after(
  AsyncTree3()
).after(...)
```

So, that's it. Hope, you liked this idea and how I explained it.

<div class="refs">References</div>

* [Cutie on GitHub](https://github.com/Guseyn/cutie)
