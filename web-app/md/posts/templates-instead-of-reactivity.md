# HTML Templates Instead of Reactivity
<div class="date">8 December 2023</div>

In this post, I will try to convince you that the amount of complexity you bring into your project to synchronize your application state with what a user sees on a screen is not worth it. **Reactivity** is not worth it. It's not worth it to use weird abstractions like **JSX** or other languages which produces **HTML** or **JS**. Bringing in build systems, package managers with tons of dependencies and other type of complexity like **Virtual DOM** just to build the frontend of your application is also not worth it.
<br>

## What's the Selling Point of Modern Frameworks?

Let's take a look at what **React** uses as an example:

```jsx
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

The idea here is that you don't need to directly update the value of the button when the value of `count` is being changed. I understand that real examples are way more complex, and while this specific example may not appear particularly impressive, it serves as a demonstration of the framework's functionality.

I also understand that the same example in other frameworks like Svelte looks less weird. My point is here that we still can reduce the amount of complexity.
<br>

## Let's First Try VanillaJS (Attempt #1)

I think the example above can be rewritten in plain JS much easier:

```html
<head>
  <script>
    function handleClick(button) {
      let count = button.getAttribute('data-count') * 1
      count += 1
      button.setAttribute('data-count', count)
      button.innerHTML = `Clicked ${count} times`
    }
  </script>
</head>
<body>
  <button
    data-count="0"
    onclick="handleClick(this)">
    Clicked 0 times
  </button>
</body>

```

While I write these words, I can already hear the voices of people complaining about how this is insufficient, how it's silly to update the DOM directly, and how it's insane to keep the application state right within the attributes of elements. It's funny because I don't really have an application state here; all I have is the DOM that contains useful information which I can extract and use. And yes, for large projects, the solution above may not be the best approach because large applications actually must have some state. So, let's talk about **application state...**
<br>

## Application State Must Be Global

The idea is that we must attach certain objects to specific elements or components cause us a lot of troubles. For some reason, we decided that global objects are evil. However, I don't see any real objective reason to think like that. Sure, there may be name collisions, but those issues are easily detectable and avoidable simply by naming things in a more concrete and distinctive way.

For some reason, it's okay to have DOM which is global within `window`. It's okay to have global structures like `sessionStorage` and `localStorage` and many other things within `window`. But it's not okay to separate global state of your application. To me it's seems inconsistent and quite harmful.
<br>

## Still VanillaJS (Attempt #2)

Let's use now global state:

```html
<head>
  <script>
    const state = {
      count: 0
    }
    function handleClick(button) {
      state.count += 1
      button.innerHTML = `Clicked ${state.count} times`
    }
  </script>
</head>
<body>
  <button
    onclick="handleClick(this)">
    Clicked 0 times
  </button>
</body>

```

As you can see, it's a bit better because we don't need the `data-count` attribute. In this case, we do use the application state, and yes, it's global.

But what if we have many more elements that must visualize data? What if we cannot attach event handlers in such a way where we can easily access our elements? I hear you, and I have a solution: `<template>`.
<br>

## So What About Templates

There is a such thing in **HTML** like [&lt;template&gt; elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). The interesting thing about this element is that it's not rendered on page load, but we can instantiate it later in JavaScript code. Just imagine that you can use such an element to rerender your view each time the application state changes.

The only problem is that there is no built-in solition about how you can map your object to that template and also there is no  default mechanism which allow you to release that template into DOM. But let's admit, it not something impossible to implement.
<br>

## Using &lt;template&gt; (Attempt #3)

Image if you could do something like this right in **HTML**:


```html
<head>
  <script>
    const state = {
      count: 0
    }
    const template = document.querySelector('#template')

    // Initial mapping
    mapToTemplate(template, state)

    function handleClick() {
      state.count += 1
      mapToTemplate(template, state)
    }
  </script>
</head>
<body>
  <template
    id="template"
    data-object-name="state">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
  </template>
</body>

```

Imagine that we had a function `mapToTemplate(template, state)` that can map state to the template and inject whole content of the template directly into the **HTML**. In the end it would look like:

```html
<head>
  <script>
    const state = {
      count: 0
    }
    const template = document.querySelector('#template')
    
    // Initial mapping
    mapToTemplate(template, state)

    function handleClick() {
      state.count += 1
      mapToTemplate(template, state)
    }
  </script>
</head>
<body>
  <button onclick="handleClick(this)">
    Clicked 0 times
  </button>
  <template
    id="template" data-object-name="state">
    <button
      data-text="Clicked ${state.count} times" 
      onclick="handleClick(this)">
    </button>
  </template>
</body>
```

As you see, we still have the possibility to release the initial **&lt;template&gt;**. By using `data-object-name`, we can define a variable name that we can reference in the **HTML** content inside the template. Attribute `data-text` indicates the inner text of the element once the value of the attribute is processed.

To be more specific about how we are going to render our template, let's improve our solution:

```html
<head>
  <script>
    const state = {
      count: 0
    }
    const template = document.querySelector('#template')
    
    mapToTemplate(template, state)

    function handleClick() {
      state.count += 1
      mapToTemplate(template, state)
    }
  </script>
</head>
<body>
  <div id="box"></div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-insert-into="#box">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
  </template>
</body>
```

By using `data-insert-into`, we can specify element selector where our template will be rendered. In this case, we insert it inside of element `#box`. So, imagine that we clicked the button 3 times, this is how our **HTML** would look like:

```html
<head>
  <script>
    const state = {
      count: 0
    }
    const template = document.querySelector('#template')
    
    mapToTemplate(template, state)

    function handleClick() {
      state.count += 1
      mapToTemplate(template, state)
    }
  </script>
</head>
<body>
  <div id="box">
    <button onclick="handleClick(this)">
      Clicked 3 times
    </button>
  </div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-where-to-place="#box"
    data-how-to-place="instead">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
  </template>
</body>
```

We can use `data-append-to="#box"`, our **HTML** code will look like:

```html
  <div id="box">
    <button onclick="handleClick(this)">Clicked 1 times</button>
    <button onclick="handleClick(this)">Clicked 2 times</button>
    <button onclick="handleClick(this)">Clicked 3 times</button>
  </div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-where-to-place="#box"
    data-how-to-place="append">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
  </template>
```

Or we can use `data-prepend-to="#box"`, then our code would look like:

```html
  <div id="box">
    <button onclick="handleClick(this)">Clicked 3 times</button>
    <button onclick="handleClick(this)">Clicked 2 times</button>
    <button onclick="handleClick(this)">Clicked 1 times</button>
  </div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-where-to-place="#box"
    data-how-to-place="prepend">
    <button data-text="Clicked ${state.count} times" onclick="handleClick(this)">
    </button>
  </template>
```

It's silly, sure. But it shows the power of such mechanism. You can already imagine, how much it's easier to share the state between many elements:

```html
<head>
  <script>
    const state = {
      count: 0,
      string: "value",
      array: [ 1, 2, 3, 4 ],
      toggle: true
    }
    const template = document.querySelector('#template')
    
    mapToTemplate(template, state)

    function handleClick() {
      state.count += 1
      state.string += ", value"
      state.array = array.map(value => value + 1)
      mapToTemplate(template, state)
    }
  </script>
</head>
<body>
  <div id="box"></div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-insert-into="#box">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
    <textarea data-value="${state.value}"></textarea>
    <template
      is="for-each"
      data-list-to-iterate="${state.array}"
      data-item-name="number">
      <div data-text="${number}"></div>
    </template>
  </template>
</body>
```

As you can see, we can even potentially use such things like "for-each" templates, which can render nested structures. In the end, we would see:

```html
<body>
  <div id="box">
    <button onclick="handleClick(this)">Clicked 3 times</button>
    <input value="value, value, value, value">
    <div>4</div>
    <div>5</div>
    <div>6</div>
    <div>7</div>
  </div>
  <template
    id="template"
    is="reusable"
    data-object-name="state"
    data-insert-into="#box">
    <button
      data-text="Clicked ${state.count} times"
      onclick="handleClick(this)">
    </button>
    <input data-value="${state.value}"></input>
    <template
      is="for-each"
      data-list-to-iterate="${state.array}"
      data-item-name="number">
      <div data-text="${number}"></div>
    </template>
  </template>
</body>
```

When we see the attribute `data-object-name`, we can appreciate the fact that this object can come from anywhere, it trully makes our template decoupled from any data source. This is true reusable components. Yes, you need to call rendering manually via `mapToTemplate`, but you gain a lot in return. You can come back to good old days and simply enjoy writing **HTML**. There's no need for strange state management libraries built upon a false sense of how an application state should be stored.

I am not going to dive into how `mapToTemplate` [is implemented](https://github.com/guseyn/ehtml). All I am trying to say is that there are more elegant ways to manage your state, and you can come up with your own. 
<br>

## Conclusion

You can give me many arguments on why such approach sucks. Like for example, you can say that manipulating **DOM** directly is slow, only to then turn around and use a library which calculates diff between **DOM** and **Virtual DOM** and does those direct manipulations anyway. I apologize, but I find it difficult to take such arguments seriously anymore.

At the very least, I hope you understand the importance of trying to achieve good results with basic technologies like **HTML** and **JS** before diving into modern frameworks.
