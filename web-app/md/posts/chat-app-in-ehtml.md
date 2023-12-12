# Chat App in EHTML
<div class="date">12 December 2023</div>

In this article, I am going to explain how you can write chat application using [EHTML](https://github.com/Guseyn/EHTML).

**EHTML (extended HTML)** is a frontend library/framework that allows you to build web apps just by focusing on HTML, meaning that the logic/functionality that you would usually write in JavaScript, you can now express via HTML.

You can find the app that I am going to describe in this article on GitHub [here](https://github.com/Guseyn/simple-chat-app).  

<!-- You can also watch the demo [here](http://www.youtube.com/watch?feature=player_embedded&v=lOf0NkNtWzI). -->

The whole appication contains just one HTML page on frontend. We have two phones on one page, and we can communicate between those two phones:

<img src="/image/chat-app.png" />

As we see, we have two phones with chat apps on them. First phone belongs to Alice, second one to Bob. Whenever Alice or Bob write and send messages, they appear on both devices. We are going to implement this page using [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). In the latest version of **EHTML**, we can create connections to those sockets(for each phone) right in HTML code.

```
<template 
 is="e-ws" 
 data-src="ws://localhost:8000" 
 data-socket-name="firstSocket"
 data-actions-on-open-connection="
    showElms('#connetion-open-message-1')
  "
>
</template>

<template
  is="e-ws" 
  data-src="ws://localhost:8000" 
  data-socket-name="secondSocket"
  data-actions-on-open-connection="
    showElms('#connetion-open-message-2')
  "
>
</template>
```

Just by using **&lt;template is="e-ws"&gt;**, we can create as many socket clients as we want. The attribute `data-socket-name` declares the name of our socket. You will be able to refer to this socket name as the source of your incoming messages and also as the destination where you can send messages to. You can use the attribute `data-connection-icon` to specify the progress icon while connections are being established. In the `data-actions-on-open-connection` attribute we can indicate somehow that the clients are connected and are ready to send and recieve messages. In this case, we are just going to show messages in the elements '#connetion-open-message-1' and '#connetion-open-message-2'.

Inside of each phone, let's add some visual elements:

```
<template 
 is="e-ws" 
 data-src="ws://localhost:8000" 
 data-socket-name="firstSocket"
 data-actions-on-open-connection="
    showElms('#connetion-open-message-1')
  "
>
  <div class="iphone">
    <div class="brove"><span class="speaker"></span></div>
    <div class="screen first"></div>
    <div class="message-box" id="message-box-1"></div> 
  </div>
</template>
```

Let's, for a moment, focus on the first phone; the second one is implemented in an identical manner.

Then let's add `#connection-open-message-1` element with a message that indicates that a user is connected:

```
<template 
 is="e-ws" 
 data-src="ws://localhost:8000" 
 data-socket-name="firstSocket"
 data-actions-on-open-connection="
    showElms('#connetion-open-message-1')
  "
>
  <span id="connection-open-message-1" class="connection-open-message">You are connected (Alice)</span>
  <div class="iphone">
    <div class="brove"><span class="speaker"></span></div>
    <div class="screen first"></div>
    <div class="message-box" id="message-box-1"></div> 
  </div>
</template>
```

The most flexible format to handle incoming message is **JSON**. We can use **e-json** element that can handle messages in **JSON** format, let's see how we can do it:

```
<template 
 is="e-ws" 
 data-src="ws://localhost:8000" 
 data-socket-name="firstSocket"
 data-actions-on-open-connection="
    showElms('#connetion-open-message-1')
  "
>
  <div class="iphone">
    <span id="connection-open-message-1" class="connection-open-message">You are connected (Alice)</span>
    <div class="brove"><span class="speaker"></span></div>
    <div class="screen first"></div>
    <div class="message-box" id="message-box-1"></div> 
    <!-- get messages (also possible to use <template is="e-json">) -->
    <e-json
      data-socket="firstSocket"
      data-response-name="socketMessageFromFirstIPhone"
      data-actions-on-response="
       mapToTemplate('#message-1', socketMessageFromFirstIPhone)
       const messageBox = document.getElementById('message-box-1')
       messageBox.scrollTop = messageBox.scrollHeight
    ">
      <template
        is="e-reusable"
        id="message-1"
        data-validation-error-class-for-element="elm-error"
        data-append-to="#message-box-1"
        data-object-name="messageFromFirstIPhone"
      >
        <div class="message-cloud" style="background-color: ${messageFromSecondIPhone.userColor}">
          <b data-text="${messageFromSecondIPhone.userName}"></b><br>
          <span data-text="${messageFromSecondIPhone.messageText}"></span>
        </div>
      </template>
    </e-json>
  </div>
</template>
```

Inside of **&lt;template is="e-ws"&gt;** we declare **&lt;e-json&gt;**(also possible with **&lt;template is="e-json"&gt;**), where we are using attribute `data-socket`. This informs **&lt;e-json&gt;** that, instead of the usual `data-src` attribute used for regular HTTP requests, we expect incoming messages in **JSON** format from the specified socket. Other things remain the same, such as `data-response-name` where you declare a variable for your response that you can use in `data-actions-on-response`.

In this case, we are mapping our incoming message on template with selector `#message-1`. Another important aspect is that we're adjusting scroll in message box, so that we can all new messages can be seen. As you see, `#message-1` template has attribute **is="e-reusable"**. That means, we can use this template multiple times. Each time we recieve a message, we map that template with incoming message.

As we see, we can refer to `messageFromFirstIPhone` that we declared in `data-object-name` inside of the template `#message-1`. We can get color, user name and message text of the incoming message and visualize them.

To send messages to the socket in **JSON** format, we can declare **&lt;e-form&gt;**. All that's needed is to declare the attribute `data-socket` where we refer to our socket. Right after **&lt;e-json&gt;**, we can declare our **&lt;e-form&gt;**:

```
<!-- send messages -->
<e-form>
  <input type="hidden" name="userName" value="Alice"></input>
  <input type="hidden" name="userColor" value="#ff9ff3"></input>
  <textarea
    required
    data-
    id="message-text-1"
    placeholder="Type your message..."
    name="messageText"></textarea>
  <button
    data-socket="firstSocket"
    onclick="
      this.form.submit(this)
      if (this.form.isValid) {
        mapToTemplate('#message-1', {
          userName: 'Alice',
          userColor: '#ff9ff3',
          messageText: document.querySelector('#message-text-1').value
        })
        changeValueOf('#message-text-1', '')
        const messageBox = document.getElementById('message-box-1')
        messageBox.scrollTop = messageBox.scrollHeight
      }
    ">
    SEND
  </button>
</e-form>
```

**&lt;e-form&gt;** allows us to send messages in **JSON** format. We are using `name` attributes as keys in that JSON payload. In this case, it's `userName`, `userColor` and `messageText`. As you, we also can add CSS classes for validation. In the button, we specify `data-socket`, it tells **&lt;e-form&gt;** that we send our message to specified socket. When you press that button, the form gets submitted (if it's valid). Also, there is a property `isValid` in the form that you can use in event listeners. Here, if everything is okay, we can also update a view with the message by `mapToTemplate()` function. In most cases web sockets on servers are implmented in a such way that you don't get your own messages, therefore you can just insert your message in the message box and adjust your scroll position as well.

Instead of `document.querySelector('#message-text-1').value`, you can implement memory storage for messages. Also you combine all actions in one function somewhere in JavaScript.
<br>

# Conclusion

So, you can use such quite straightforward and declarative approach where you encapsulate the logic on web sockets right into the HTML.

<br>

<!-- [Reddit Comments](https://www.reddit.com/user/gyen/comments/11lbupc/blog_app_in_ehtml/) / [HN Comments](https://news.ycombinator.com/newest) / [Medium Comments](https://medium.com/@guseynism/blog-app-in-ehtml-93a0aacaed1d) -->

<div class="refs">References</div>
* [Chat app on GitHub](https://github.com/Guseyn/ehtml-simple-chat-app)
* [EHTML](https://github.com/Guseyn/EHTML)
