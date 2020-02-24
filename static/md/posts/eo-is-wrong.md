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

![composable](/../../image/composable.png)

So it should be composable. On the other hand, following picture shows us a bad structured program:

![procedural](/../../image/procedural.png)

And I cannot agree more. I also think that a good program on the API level should have composable structure. But does it make sense to use objects for that?

Let's take a look at this `Book` object.

```java
final class Book {

  private final String title;
  private final String author;

  public Book(final String title, final String author) {
    this.title = title;
    this.author = author;
  }

  public String json() {
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
final class Library {

  private final List<Book> books;

  public Library(final Book ...books) {
    this.books = Arrays.asList(books);
  }

  public String json() {
    return String.format(
      "{ \"books\": [ %s ] }",
      books.stream()
        .map(Book::json)
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
).json()
```

So, "What is the problem?" you might ask. Well, the main problem is here that `Library` and `Book` are composable only for `json()` method. What if we want want also to represent `Book` and `Library` in XML format?

**EO** suggests us such thing like "Media" in [this article](https://www.yegor256.com/2016/04/05/printers-instead-of-getters.html). So we do something like this:

```java
JsonMedia media = new JsonMedia("books");
new Book("In Search of Lost Time", "Marcel Proust").print(media);
new Book("Ulysses", "James Joyce").print(media);
new Book("Don Quixote", "Miguel de Cervantes").print(media);
JsonObject json = media.json();
```

Or we can do it via `Library` object:

```java
JsonMedia media = new JsonMedia("books");
new Library(
  new Book("In Search of Lost Time", "Marcel Proust"),
  new Book("Ulysses", "James Joyce"),
  new Book("Don Quixote", "Miguel de Cervantes")
).print(media)
JsonObject json = media.json();
```

Is this code composable? For me it looks very procedural. More over you can see that media has mutable nature. 

What if we want to print to console our json representations of our objects? In **EO** style I do something like:

```java
final class PrintableText implements Printable {

  private final String text;

  public PrintableText(final String text) {
    this.text = text;
  }

  @Override
  public void print() {
    System.out.println(this.text);
  }
}
``` 

And that's how we can print our json text by using "Media" abstraction:

```java
JsonMedia media = new JsonMedia("books");
new Library(
  new Book("In Search of Lost Time", "Marcel Proust"),
  new Book("Ulysses", "James Joyce"),
  new Book("Don Quixote", "Miguel de Cervantes")
).print(media)
JsonObject json = media.json();
new PrintableText(json.toString()).print()
```

Our code is not becomming more composable. **EO** allows `void` methods, which is a big mistake. Because it means that you can't even make compositions for such methods.

I mean it's okay, but do we really make our code composable or we just create objects with `new` key words. Instead of one big composition we have a lot of different compositions which are in different places in our program.

So, **EO** principles do not bring us the structure of code that we have on the first picture, it looks more like this:

![procedural](/../../image/eo.png)

On one hand it makes situation a bit better because at least we have compositions: the idea of breaking complex logic into smaller objects. And I like this idea. But connections between these composition are still "procedural" as you can imagine and it makes the whole situation even worse.

I understand your frustration(if you have it). Probably you don't even understand what I am trying to prove. But give me a chance. Let's see how we can improve the situation and write the logic a bit different so you can understand me.

I think there is a better solution than "Media". Instead of `Book` we should have an object `BookAsJSON`,  which looks like:

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

  public Library(BookAsJSON ...books) {
    this.books = Arrays.asList(books);
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

As you can see in all our classes we use `value()` method which represents particular object. So our composition would look like:

```java
new PrintedLibraryAsJSON(
  new LibraryAsJSON(
    new BookAsJSON("In Search of Lost Time", "Marcel Proust"),
    new BookAsJSON("Ulysses", "James Joyce"),
    new BookAsJSON("Don Quixote", "Miguel de Cervantes")
  )
).value()
```

As you can see here, we don't have different methods like `json()` and `print()`. We use only one method `value()` in each class, which means that every object in our program can be a part of one composition.

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
    JsonMedia media = new JsonMedia("books");
    new Library(
      new Book("In Search of Lost Time", "Marcel Proust"),
      new Book("Ulysses", "James Joyce"),
      new Book("Don Quixote", "Miguel de Cervantes")
    ).print(media)
    JsonObject json = media.json();
    new PrintableText(json.toString()).print()
  }
}
```

Which one is more elegant? I hope you understand my point as we are talking about serious and complex shit here. In order to have one composition which represents our program, each of our objects must have only one method `value()` which represents it.

I understand that **EO** allows you to create classes with such `value()` methods(as far as I know it's not prohibited yet). But the main idea of **EO** are decorators, which are completely different thing. Decorators are for extending behaviour of objects, while objects with such `value()` methods are for explicit passing their representations. And I think the last type of objects has much more sense.

I read a lot of **EO** code last days and I can tell you for sure that the code in such style can be also quite unmaintainable. Only some of **EO** classes are small, but there are also a lot of [big classes](https://github.com/yegor256/rultor/blob/master/src/main/java/com/rultor/dynamo/DyTalks.java) which are way more difficult to maintain because they have different methods with big and weird compositions of decorators mixed with static methods(which is funny as they are prohibited by **EO**).

I have never met in the **EO** theory that each object **must** have such `value()` method. But as I see, that's the only way to build a program with a structure like on the first picture. 

And you know why **EO** does not suggests such solution? Because it's pointless to have such objects with just one `value()` method.

Funny fact is that you don't even need objects, you can write declaratively without them:

```java
printed(
  libraryAsJSON(
    bookAsJSON("In Search of Lost Time", "Marcel Proust"),
    bookAsJSON("Ulysses", "James Joyce"),
    bookAsJSON("Don Quixote", "Miguel de Cervantes")
  )
)
``` 

And just look at how simple these functions are:

```java
public static String bookAsJSON(final String title, final String author) {
  return String.format(
    "{ \"title\":\"%s\", \"author\":\"%s\" }",
    title,
    author
  );
}

public static String libraryAsJSON(final String ...books) {
  return String.format(
      "{ \"books\": [ %s ] }",
      String.join(", ", Arrays.asList(books))
  );
}

public static String printed(final String text) {
  System.out.println(text);
  return text;
}
```

Each of these functions has the logic from `value()` method of the corresponding object. Yeah, and it's called functional programming. Everyone knows it, right?

But it's sooo much more boring than selling the idea that everyone makes OOP wrong. But guess what, everyone makes OOP wrong, even ones who do it in **EO** style. Because OOP does not bring us first picture. OOP is wrong.

That's it.
