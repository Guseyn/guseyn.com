# What's Wrong With EO
<div class="date">22 February 2020</div>

<div class="tags">
  <a class="tag" href="/../tags/oop?v={version}">oop</a>
  <a class="tag" href="/../tags/eo?v={version}">eo</a>
  <a class="tag" href="/../tags/java?v={version}">java</a>
</div>

<div class="quote">
  <div class="quote-text">
    &ldquo;&nbsp;&nbsp;A man should look for what is, and not for what he thinks should be.&nbsp;&nbsp;&rdquo;
  </div>
  <div class="quote-author">
    Albert Einstein
  </div>
</div>

If you don't know what **Elegant Objects**(or **EO**) conception is, you should check [these articles](https://www.yegor256.com/tag/oop.html) out in order to understand this particular article(I read them all). I will try to explain why the whole idea of **EO** is not solving the main problem that it's supposed to solve: maintainability.

Accroding to the **EO** good program must have following structure:

![composible](/../../image/composible.png)

So it should be composible. On the other hand, following picture shows us a bad structured program:

![procedural](/../../image/procedural.png)

And I cannot agree more. I also think that a good program on the API level should have composible structure. But does it make sense to use objects for that?

Let's take a look at this `Book` object.

```java
class Book {

  private final String title;
  private final String author;

  public Book(final String title, final String author) {
    this.title = title;
    this.author = author;
  }

  public String toJSON() {
    return String.format(
      "{ \"title\":\"%s\", \"author\":\"%s\" }",
      this.title,
      this.author
    );
  }
}
```

And let's say we have another object `Library` which contains a list of books:

```java
class Library {

  private final List<Book> books;

  public Library(final List<Book> books) {
    this.books = books;
  }

  public String toJSON() {
    return String.format(
      "{ \"books\": [ %s ] }",
      books.stream()
        .map(Book::toJSON)
        .collect(Collectors.joining(", "))
    );
  }
}
```

And that's how composition of these objects looks like:

```java
new Library(
  new Book("In Search of Lost Time", "Marcel Proust"),
  new Book("Ulysses", "James Joyce"),
  new Book("Don Quixote", "Miguel de Cervantes")
).toJSON()
```

So, "What is the problem?" you might ask. Well, first problem is here that you cannot just call this composition in Java, you have to use it in some method of some class where this logic is needed:

```java
class SomeClassThatHasToUseLibrary {
  private final Library Library;

  public SomeClassThatHasToUseLibraary(final Library library) {
    this.library = library;
  }

  public void printedLibraryAsJSON() {
    System.out.println(this.library.toJSON())
  }
}
```

Or you can simply do something like this:

```java
class SomeClassThatHasToUseLibrary {
  public SomeClassThatHasToUseLibrary() {}

  public void printedLibraryAsJSON() {
    System.out.println(
      new Library(
        new Book("In Search of Lost Time", "Marcel Proust"),
        new Book("Ulysses", "James Joyce"),
        new Book("Don Quixote", "Miguel de Cervantes")
      ).toJSON()
    )
  }
}
```

But the composition you use in the method `printedLibraryAsJSON` just handles one behaviour. This method works only for converting objects to JSON format.

You might think that I am crazy and `SomeClassThatHasToUseLibrary` should work in the composition as well:

```java
new SomeClassThatHasToUseLibrary(
  new Library(
    new Book("In Search of Lost Time", "Marcel Proust"),
    new Book("Ulysses", "James Joyce"),
    new Book("Don Quixote", "Miguel de Cervantes")
  ).toJSON()
).printedLibraryAsJSON()
```

But again you cannot call this composition just as it is. You must call it in a some method of some class. And as far as I know, **EO** does not prohibit `void` methods, so you cannot even use `SomeClassThatHasToUseLibrary` as argument for other methods using `printedLibraryAsJSON()` method.

You can see that we use methods `toJSON()` and `printedLibraryAsJSON()`, but just imagine that we have a lot more different objects with more methods. Let's say we want to be able to print our objects in XML as well. So we have to add method `toXML()` to `Library` and `Book` classes, and method `printedLibraryAsXML()` to `SomeClassThatHasToUseLibrary` class.

I mean it's okay, but do we really make our code composible or we just create objects with `new` key words. Instead of one big composition we have a lot of different compositions which are in different places in our program.

So, **EO** principles do not bring us the structure of code that we have on the first picture, it looks more like this:

![procedural](/../../image/eo.png)

On one hand it makes situation a bit better because at least we have compositions: the idea of breaking complex logic into smaller objects. And I like this idea. But connections between these composition are still "procedural" as you can imagine and it makes the whole situation even worse.

I understand your frustration(if you have it). Probably you don't even understand what I am trying to prove. But give me a chance. Let's see how we can improve the situation and write the logic a bit different so you can understand me.

I think in order to have one big composition each object in our program must have one method, which represents it. The perfect name, in my opinion, for this method is `value()`. Object also can have other different methods, but for each of these methods we must have a separate object with method `value()` which represents the value of the particular method. 

So instead of `Book` we should have object `BookAsJSON`  which looks like:

```java
class BookAsJSON {

  private final String title;
  private final String author;

  public BookAsJSON(final String title, final String author) {
    this.title = title;
    this.author = author;
  }

  public String value() {
    return String.format(
      "{ \"title\":\"%s\", \"author\":\"%s\" }",
      this.title,
      this.author
    );
  }
}
```

And other object `LibraryAsJSON`

```java
class LibraryAsJSON {

  private final List<BookAsJSON> books;

  public Library(final List<BookAsJSON> books) {
    this.books = books;
  }

  public String value() {
    return String.format(
      "{ \"books\": [ %s ] }",
      books.stream()
        .map(Book::value)
        .collect(Collectors.joining(", "))
    );
  }
}
```

And finally we need an object `PrintedLibraryAsJSON` which also must have `value()` method:

```java
class PrintedLibraryAsJSON {
  private final LibraryAsJSON library;

  public PrintedLibraryAsJSON(final LibraryAsJSON library) {
    this.library = library
  }

  public String value() {
    final String json = library.value()
    System.out.println(json)
    // We must return something even here
    return json
  }
}
```

So our composition would look like:

```java
new PrintedLibraryAsJSON(
  new LibraryAsJSON(
    new BookAsJSON("In Search of Lost Time", "Marcel Proust"),
    new BookAsJSON("Ulysses", "James Joyce"),
    new BookAsJSON("Don Quixote", "Miguel de Cervantes")
  )
).value()
```

As you can see here, we don't have different methods like `toJSON()` and `printedLibraryAsJSON()`. It allows us to have meaningfull name for class `PrintedLibraryAsJSON` as it just represents some json that has been printed to console.

And the only place we call our compisition is the the `main()` method in our let's say `App` class.

```java
class App {
  public static void main(String[] args) {
    new PrintedLibraryAsJSON(
      new LibraryAsJSON(
        new BookAsJSON("In Search of Lost Time", "Marcel Proust"),
        new BookAsJSON("Ulysses", "James Joyce"),
        new BookAsJSON("Don Quixote", "Miguel de Cervantes")
      )
    ).value()
  }
}
```

Because with such approach you don't have other places for your compositions. You have one and only one. And it's in the entry point of your program(!!). You don't use compositions in some methods of some objects. And you don't make procedural connections between compositions because you have only one.

Let's just compare two approaches again:

```java
// Pure approach
class App {
  public static void main(String[] args) {
    new PrintedLibraryAsJSON(
      new LibraryAsJSON(
        new BookAsJSON("In Search of Lost Time", "Marcel Proust"),
        new BookAsJSON("Ulysses", "James Joyce"),
        new BookAsJSON("Don Quixote", "Miguel de Cervantes")
      )
    ).value()
  }
}

// EO approach
class App {
  public static void main(String[] args) {
    new SomeClassThatHasToUseLibrary(
      new Library(
        new Book("In Search of Lost Time", "Marcel Proust"),
        new Book("Ulysses", "James Joyce"),
        new Book("Don Quixote", "Miguel de Cervantes")
      ).toJSON()
    ).printedLibraryAsJSON()
  }
}
```

I hope you understand my point as we are talking about serious and complex shit here. In order to have one composition which represents our program, our objects must have only one method `value()` which represents it.

I understand that **EO** allows you to create classes with such `value()` methods(as far as I know it's not prohibited yet). But the main idea of **EO** are decorators, which are completely different thing. Decorators are for extending behaviour of objects, while objects with such `value()` methods are for explicit passing their representations. And I think the last type of objects has much more sense.

I have never met in the **EO** theory that each object **must** have such `value()` method. But as I see, that's the only way to have program with a structure like on the first picture. Otherwise, if you use different methods in you objects, you are forsed to create different compositions in different places of your program instead of having one good composition in the entry point of it. 

And as a result you get very weird mix of declarative and imperative code in different places, which looks very ugly to me.

I read a lot of **EO** code last days and I can tell you for sure that it's true. Only some of **EO** classes are small, but there are also a lot of [big classes](https://github.com/yegor256/rultor/blob/master/src/main/java/com/rultor/dynamo/DyTalks.java) which are way more difficult to maintain because they have different methods with big compositions of decorators mixed with static methods.

Again, I have never met in the **EO** theory that each object **must** have `value()` method which represents it and allows us to build good composible code. And you know why **EO** does not have such point? Because it's pointless to have such objects with just one `value()` method.

Funny fact is that you don't even need objects, you can write declaratively without them:

```java
printedJSON(
  libraryAsJSON(
    bookAsJSON("In Search of Lost Time", "Marcel Proust"),
    bookAsJSON("Ulysses", "James Joyce"),
    bookAsJSON("Don Quixote", "Miguel de Cervantes")
  )
)
``` 

Each of these functions has the logic from `value()` method of the corresponding object. You can notice that with such approach we just need `printedJSON` and we don't have to care about type of the object, which we want to print json format for.

Yeah, and it's called functional programming. Everyone knows it, right?

But it's sooo much more boring than selling the idea that everyone makes OOP wrong. But guess what, everyone makes OOP wrong, even ones who do it in **EO** style.

That's it.
