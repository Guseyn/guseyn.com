# Data Type Should Not Be Considered As a Source of Its Behaviour
<div class="date">31 May 2020</div>

<div class="tags">
  <a class="tag" href="/../tags/programming?v={version}">programming</a>
  <a class="tag" href="/../tags/codedesign?v={version}">code design</a>
</div>

<div class="quote">
  <div class="quote-text">
    &ldquo;&nbsp;&nbsp;Truth is ever to be found in the simplicity, and not in the multiplicity and confusion of things.&nbsp;&nbsp;&rdquo;
  </div>
  <div class="quote-author">
    Isaac Newton
  </div>
</div>

When you start learning a programming language(or just programming in general), usually there are first few chapters in books that introduce us such thing like **data types** (or just **types**). And we don't focus on this subject as much as we should because it's so simple, right? Well... I think that there is one little detail which can lead to big mistakes of understanding what really data type is.

Let's start with primitive data types like `byte`, `number`, `string`, `boolean` and so on. Most programming languages support them is some or other forms. And in most cases they are not attached to any functions. Interpreter of a programming language can apply operators or functions on them, so we don't have to deal with such things. For example, we don't have to impelment binary operator like plus (**`+`**) for `numbers` and `strings`.  I want to emphesize the fact that (**`+`**) operator can be also considered as a simple function, as it's just one of the syntax variations of how we can write it in our code. For example, in PHP language we use operator dot (**`.`**) for concatenating strings, not (**`+`**). So, basically for primitive data types we don't have to declare and implement operations which can be applicable for them.

Then it becomes more interesing with such type like array, which in most cases is just a set of pointers to other types. In the code we declare array via brackets: `[` and `]`, and inside of this brackets we list its pointers or elements. For example, that's how we declare an array in JavaScript:

```js
/* In JavaScript we can use different types 
    of elements in array as it's dynamic language */

const array = [ 1, '2', 3, true ]
```

Most languages attach functions like `add()`, `size()`, `get()` and so on to this type, so we can do following:

```js
// Pseudo code
array = []
array.add(1)
array.add(true)
array.get(0) // is 1
```

Of course for languages like Java we can only assign and get pointers by their indexes directly, but in most dyncamic languages we actually can do something like it's been shown above.

Before we continue let's see the definition of data type which is given in Wikipedia:

&ldquo;In computer science and computer programming, a data type or simply type is an attribute of data which tells the compiler or interpreter how the programmer intends to use the data.&rdquo;

But do we really need to put the information of such intention inside of types? Well, it's a good question.

<br>
## Behavioural Dualism in Data Types

When you look at following expression:

```js
array.add(5)
```

Don't you ask yourself, why we don't do otherwise like:

```
5.addToArray(array)
```
You might think this is ridiculous nonsense, but is it?

In object-oriented languages we have such things like interfaces, usually they are represented as a set of operations or methods that can be applied for them. And basically we define custom types via such abstractions. After constructing some interface we have to override such operations in some class that implements it. Let's take a look at following interface in Java:

```java
// Simple variation of List from JDK (just for Object)
public interface List {
  int size();
  boolean isEmpty();
  boolean contains(Object obj);
  Object[] toArray();
  Object get(int index);
  Object set(int index);
  void add(Object obj);
  void remove(Object o);
  void sort(Comparator<? super E> c);
  void clear();
  /** many many other mathods... **/
}
```

So, in interfaces we don't implement methods, we just declare what kind of methods they support (so we can implement them in classes, which are based on such interfaces later on). 

But here is the thing... Theoretically there are unlimited number of methods or operations for every type. If you think about `List` interface for a second, you can come up with many ideas: to save a list to some database, to send its representation via HTTP request, to cache it in memory or to convert it to a string, we can do literally whatever we want.
Actually, if you look at real `List` from `java.util` package in JDK, you'll see tons of methods, which every class must(!) override if you want to create an implmentation of `List`. But do we really need all of them in our program?

Another problem is here that for some reason we decided that a certain operation belongs to a certain type. That's what I would call &ldquo;behavioural dualism in data types&rdquo;. Let's take a look at two following interfaces `Teacher` and `Student`:

```java
public interface Teacher {
  void giveInformation(Student student, Information information);
}

public interface Student {
  Assessment studyInformation(Information information);
}
```

Sounds logical, right? Well, is following logical too?

```java
public interface Student {
  Information getInformation(Teacher teacher);
}

public interface Information {
  Assessment processBy(Student student);
}
```

Or maybe we just place all logic in one place?

```java
public interface Information {
  void transfer(Teacher teacher, Student student);
  Assessment processBy(Student student);
}
```

What about another place?

```java
public interface Assessment {
  void give(Teacher teacher, Student student, Information information);
}
```

So, which of these three varations is correct? Or maybe all them are correct? You also might say that it depends, right? But how to decide the right way of representing behaviour in our program?

Looking at these interfaces you can simplify all the logic just in one simple function:

```js
// Pseudo code
Assessment assessment = givenAssessment(
  fromTeacher, toStudent, forInformation
)
```
where `Teacher`, `Student` and `Information` are just data structures for function `givenAssessment()` that produces another structure `Assessment`. And in this case we always deal with real data, because even though `givenAssessment()` is a function, it actually represents `Assesment` which is expressed in the name of the function. This is the reason actually why I use only nouns with verb adjectives in function names as it makes the code declarative. And if you name arguments properly, you can actually read the code like in plain English: 

&ldquo;It's a given assessment from a teacher to a student for the information (which the teacher gave to the student).&rdquo;

<br>

## Behaviour does not belong to a data type

The main point which I am trying to prove is that operations, functions or methods in our code should not be attached to any types, because any function can process different types that can co-exists only in a context which presents there. In another words, data types should not dictate what kind of functions they are applicable to, it's the functions who dictate what kind of types they can process.

So, instead of

```js
array.add(element)
```

we need to be able to write something like:

```js
array = arrayWithNewElement(array, element)
```

Or instead of

```js
db.save(user)
```

we can write something like:

```js
user = savedUserIntoDatabase(db, user)
```

So, why is suggested approach better? Well, I can come up with some pros:
<br><br>
1. We have only one single point of behaviour, which is a some function that can do the whole work.
2. We don't have to build (or implment) types from their behaviour, the only thing we need is data. And when it's needed we can add functions that can process certain types of our data.
3. We don't have so called behavioural dualism in data types, where it's not clear why certain types are attached to certain methods, because it's no longer possible as we separate data from behaviour. It's really important, because sometimes when we mix them, we often create meaningless types, which are not even in our business logic.
4. Our code is decomposed. If we create proper functions, the only thing we need to do is just pass arguments and get result by invoking them.
5. Our code becomes more declarative if we use proper naming of functions. And by proper naming I mean that we express the whole idea of behaviour behind the function, the result that we get from it and maybe even sometimes arguments which are required for the function. So, instead of thinking about how we build result, we actually see the result. For example,

```java
List<User> users = filteredUsersFromDatabaseByAgeAndGenderAndWhoIsFriendWithSpecifiedUser(db, 25, 'women', someUser)
```

If you think that's very verbose, well... Just read it, and you'll see that there is nothing to remove from the name. And the only thing you need to do is just to read, you don't have to guess. After reading just the name of the function you'll understand what structure you get from the function (`User`), behaviour of the function (filtering) and of course what arguments you need for the function (database, age, gender, specified user who is friend).

Sure we can create dozen of interfaces like `DB`, `User`, `Gender`, `Friend` or some others and create a lot of complexity. But if we just need to get real result, we just can do it with one function.

I don't know about you, but I would gladly read such long code all the time. Because I like to read, I don't like to guess.

This is it.

[Reddit Comments](https://www.reddit.com/user/gyen/comments/gu6xc5/data_type_should_not_be_considered_as_a_source_of/)
