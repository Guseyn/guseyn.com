# Object-oriented programming. What else did you expect?
<div class="date">2 April 2020</div>

<div class="tags">
  <a class="tag" href="/../tags/oop?v={version}">oop</a>
  <a class="tag" href="/../tags/java?v={version}">java</a>
</div>

<div class="quote">
  <div class="quote-text">
    &ldquo;&nbsp;&nbsp;If you’re going through hell, keep going.&nbsp;&nbsp;&rdquo;
  </div>
  <div class="quote-author">
    Winston Churchill
  </div>
</div>

Object-oriented programming(and I am not going to cut it further in the article) is extremely complex subject to discuss. Not only because it has such term like **object** as the core idea of this paradigm, which can be interpreted in many different ways, but because even if there is some agreement about what **object** really is, there are a lot of questions on how to implement it technically.

The main point of this article is to show what *object-oriented programming* can give us in terms of structuring our code in a better way than uhm... Let's say in a better way than standard procedural programming on example of Java, which may be claimed like not true object-oriented language, but still it can be quite good for showing some examples.

I want to split this article into three parts:

1. In the first part, I want to show you my understanding of two different approaches that we can use in our code: *declarative* and *imperative*.

2. In the second part, I want to show that procedural programming mostly is in the imperative style, so I'll try to make some examples of object-oriented code in the declarative style. Not because object-oriented code necessarily should be declarative, but because I want to have at least something that can be different between procedural programming and object-oriented programming and via such difference show you a way that object-oriented code can be written differently than procedural code.

3. In the third part, I just want to summarize my thoughts about the attempts which I'll have made in the second part.

<br/>
## Imerative and Declarative

Why is the following code declarative?

```sql
SELECT * FROM 'users' WHERE age > 20;
```

I think it's because we don't know how exactly we select users who are older than 20 years. But we know we would get requested people if underlying program works correctly.

Why is the next example declarative?

```html
<html>
  <head>
    <title>Object-oriented programming.</title>
  </head>
  <body>
    <p>
      What else did you expect?
    </p>
  </body>
</html>
```

I think it's declarative because we don't know how exactly this HTML page is rendered. But we know that we would see rendered page with expected title and text in it if our browser works properly.

Why is the next code is declarative?

```java
new Book(
  'How to Ruin Everything: Essays',
  'Watsky, George'
).numberOfReviews();
```

I think it's declarative because we don't know how exactly number of reviews is calculated, but we know that if program works properly we would get the correct number.

Why is the following code declarative?

```java
Book book = new Book(
  'How to Ruin Everything: Essays',
  'Watsky, George'
);
int numberOfReviews = book.numberOfReviews();
int numberOfPositiveReviews = book.numberOfPositiveReviews();
int successCoefficient = numberOfPositiveReviews / numberOfReviews;
System.out.println("success coefficient is:" + successCoefficient);
```

Well, I think it's not. I think it's imperative. Although we have some declarative code here, we see how "success coefficient" is calculated. The size of the programm is too small, so it's not so difficult to see the final result, but we see internal details of how we get it.

So basically, in Java we have objects which can compute something via methods, some **results** of some processes that we can use for other stuff in our program later on. 

So, let's say our goal now is to represent our program as a declarative structure where our computing can be hidden. Let's try!

<br/>
## Making it Declarative

Let's take a look at the following example:

```java
Element html = new HtmlElement()
html.add(new HeadElement())
Element body = new BodyElement()
Element div = new DivElement(“text”)
body.add(div)
html.add(body)
String htmlAsString = html.string()
```

I think we see here procedural code via objects. Other people would say it's object-oriented code. There is no point in arguing about that. In some sence, I also think it's object-oriented code, well... because we use objects, right?

We definetly see mix of declarative and imperative code here. On one hand, we don't know for example how method `add()` works, but we understand that somehow this method adds elements as children into some parent element. But on the other hand, we see the whole process of how the final result `htmlAsString` is constructed. 

I think, it's rather imperative code than declarative. Why? Because it can be more declarative:

```java
new HtmlAsString(
  new HtmlElement(
    new HeadElement(),
    new BodyElement(
      new DivElement(“text”) 
    )  
  )
)
```

Here, we don't see any process of how we build our final result. We actually see the result through this composition of objects. Let's try to read the code: "I see a string from html structure with head element and body element that contains some text". It's like SQL or HTML. Only thing we see here is the result of our program, we actually see it.

Let's try to do the same with our example with `Book` object. So again, our code in the imperative style is:

```java
Book book = new Book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
);
int numberOfReviews = book.numberOfReviews();
int numberOfPositiveReviews = book.numberOfPositiveReviews();
int successCoefficient = numberOfPositiveReviews / numberOfReviews;
System.out.println("success coefficient is:" + successCoefficient);
```

### Attempt #1. Decomposing.

Let's make our code declarative via some object `SuccessCoefficient`. I will not show intentionally how the object is implemented, because the only thing I just want to show is how API can be desinged.

```java
int successCoefficient = new SuccessCoefficient(
  new Book(
    'How to Ruin Everything: Essays',
    'Watsky, George'
  )
).value();

System.out.println("success coefficient is:" + successCoefficient);
```

The situation is much better in terms of declarativeness, because we don't know how "success coefficient" is calculated, we just can see it. But we still need to print our result. We can do something like:

```java
System.out.println(
  "success coefficient is:" +
  new SuccessCoefficient(
    new Book(
      "How to Ruin Everything: Essays",
      "Watsky, George"
    )
  ).value()
);
```

The problem is here that we cannot use our result that has been printed later on in our program. If we want to be able to use our printed result, we need to break our composition and it will lead to imperative code again. So what's the solution?

### Attempt #2. *'As'* conception.

Let's say we can create varaibles in the declarative style via `As` object. I have no idea how to implement it in Java. But I use such conception in JavaScript in lot of my libraries. But let's assume that we have such implmeneted abstraction in Java. So, how it would look like?

I think, something like this:

```java
new SuccessCoefficient(
  new Book(
    "How to Ruin Everything: Essays",
    "Watsky, George"
  )
).as('SUCCESS_COEFFICIENNT').after(
  new Printed(
    new As('SUCCESS_COEFFICIENNT')
  )
).run();
```

Let's assume that every object in our program can be cached via `as()` method. And `As` object can get the value by unique `key`. And if we try to save several values with the same `key` in our composition, the program would throw an exception. 

Why do I think the presented code is declarative? Well, first of all, because following code would not work:

```java
int successCoefficient = new SuccessCoefficient(
  new Book(
    "How to Ruin Everything: Essays",
    "Watsky, George"
  )
).run();
```

Because all objects present themselves only in the composition, you cannot just get result from object via `method` in the imperative style. If you want to use the representation of object, you should use it in the composition.

With `As` abstraction, we actually have a nested sequence of several compositions. We just cache our representations of objects via "declarative variables". You might think, why not just write instead something like:

```java
int successCoefficient = new SuccessCoefficient(
  new Book(
    "How to Ruin Everything: Essays",
    "Watsky, George"
  )
).value();

new Printed(
  successCoefficient
).run();
```

Of course we can, but we break our structure by doing that, and it will lead again to imperative code where we expose the logic of our program. And if we want to keep our code declarative, we will be forced to create another object that hides the logic.

### Attempt #3. Smart Object... or again decomposing?

We can design our code in another way, for example:

```java
new SuccessCoefficient(
  new Book(
    "How to Ruin Everything: Essays",
    "Watsky, George"
  )
).print();
```

It's quite declarative, isn't?

Obviously, our object `Book` can have method `printSuccessCoefficient()`, right? Why do we even need `SuccessCoefficient` object in the first place? Well, it makes sence.

```java
new Book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
).printSuccessCoefficient();
```

This is great, isn't? But here actually we have another problem. Our object `Book` is too smart. Because it can provide "success coefficient" and it can also print it. Our object `Book` will grow and grow. 

For example, if want to send "success coefficient" via email, we can't just have another method in `Book` like `sendSuccessCoefficientViaEmail()`, I think it would cause a lot of problems with maintainability.

So, where would we put our method `sendSuccessCoefficientViaEmail()` then? We could put it in `SuccessCoefficient` object. Sure, it's better than putting it into `Book` object. But, the best approach would be to create object `Email`: 

```java
new Email(
  new SuccessCoefficient(
    new Book(
      "How to Ruin Everything: Essays",
      "Watsky, George"
    )
  )
).send("Success coefficient of your book is: %d");
```

Now, as you can remember, we might still need things like: `numberOfPositiveReviews`, `numberOfReviews`. So, basically in such case we would need three methods (including `successCoefficient`) in `Book` object. And if we would need more things from `Book` we would add more methods, which is something you probably don't want to do as it will make the object too big. So, we would probably create three objects: `NumberOfPositiveReviews`, `NumberOfReviews` and `SuccessCoefficient`.

And let's say in the email we also want to have number of reviews and number of positive reviews along with "success coefficient". Again, we don't want to have another method in `Book`, which creates text of email that based on these three numbers. So, like in the [**Attempt #1**](#attempt1decomposing) we would do decomposition via another object `TextWithBookStats`:

```java
new Email(
  new TextWithBookStats(
    "Success coefficient of your book is: %d, it's based on number of reviews: %d and number of positive reviews: %d",
    new Book(
      "How to Ruin Everything: Essays",
      "Watsky, George"
    )
  )
).send();
```

Stop! But how `TextWithBookStats` knows about stats of `Book` if we decided to decompose its methods. Our code should look differently:

```java
Book book = new Book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
)
new Email(
  new TextWithBookStats(
    "Success coefficient of your book is: %d, it's based on number of reviews: %d and number of positive reviews: %d",
    new SuccessCoefficient(book),
    new NumberOfReviews(book),
    new NumberOfPositiveReviews(book)
  )
).send();
```

Here we might have another problem: calculating the number of reviews and number of positive reviews might be very extensive, and we do it twice for each number, because "success coefficient" is based on them. So, let's optimize our code:

```java
Book book = new Book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
)
int numberOfReviews = new NumberOfReviews(book).value();
int numberOfPositiveReviews = new NumberOfPositiveReviews(book).value();
new Email(
  new TextWithBookStats(
    "Success coefficient of your book is: %d, it's based on number of reviews: %d and number of positive reviews: %d",
    new SuccessCoefficient(numberOfReviews, numberOfPositiveReviews),
    numberOfReviews,
    numberOfPositiveReviews
  )
).send();
```

Is this code declarative? I would say it's still quite declarative, sure. But we spent so much energy and time doing that via objects in Java. Is it worth it? Well...

<br/>
## Object-oriented programming. Is it the way to write declarative code?

If you have read everything till this point, I can only say "Thank you for your time and energy! Thank you very much!".

So, we actually can write declarative code using object-oriented programming or objects.

But while we were doing it, we had to consider a lot of stuff. Most of them is about do we really need a particular method in our objects or not. And in most cases we had to decompose our object methods into another objects, because otherwise they would grow and become unmaintainable eventually. But we were doing that not because we actually needed another object in our system, but because we had to somehow to manage the size and complexity of existing objects. 

I mean if we constantly have to decompose our methods in our objects into another objects to keep our code declarative and simple, why do we need objects in the first place?

If you look at the last code snippet above, you'll see declarative code, sure! But is it better than let's say following pseudo code?  

```js
book = book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
)
numberOfReviews = calculatedNumberOfReviews(book)
numberOfPositiveReviews = calculatedNumberOfPositiveReviews(book)
sentEmail(
  textWithBookStats(
    "Success coefficient of your book is: %d, it's based on number of reviews: %d and number of positive reviews: %d",
    calculatedSuccessCoefficient(
      numberOfReviews,
      numberOfPositiveReviews
    ),
    numberOfReviews,
    numberOfPositiveReviews
  )
)
```

Or we can design our code in the extreme declarative way as it's been shown in the [**Atemmpt #2**](#attempt2asconception):

```js
book(
  "How to Ruin Everything: Essays",
  "Watsky, George"
).as('BOOK').after(
  numberOfReviews(as('BOOK')).as('NUMBER_OF_REVIEWS').after(
    numberOfPositiveReviews(as('BOOK')).as('NUMBER_OF_POSITIVE_REVIEWS').after(
      sentEmail(
        textWithBookStats(
          "Success coefficient of your book is: %d, it's based on number of reviews: %d and number of positive reviews: %d",
          successCoefficient(
            as('NUMBER_OF_REVIEWS'),
            as('NUMBER_OF_POSITIVE_REVIEWS')
          ),
          as('NUMBER_OF_REVIEWS'),
          as('NUMBER_OF_POSITIVE_REVIEWS')
        )
      )
    )
  )
)
```

Well, it's up to you to decide. But I don't see too much sence in objects for writing declarative code. It's possible, of course! But if we want to keep our code simple and declarative at the same time, we need to constantly decompose methods in objects into another different objects. But we can just have simple functions which are already small and decomposed, so that we don't need to spend our energy and time on decomposing such things like objects.

This is it.

[Reddit Comments](https://www.reddit.com/r/OOP/comments/ftbdym/objectoriented_programming_what_else_did_you/)
