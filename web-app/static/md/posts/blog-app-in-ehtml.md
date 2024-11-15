# Blog App in EHTML
<div class="date">7 March 2023</div>

In this article, I am going to explain how you can write basic blog application using [EHTML](https://github.com/Guseyn/EHTML/tree/master/src).

**EHTML (extended HTML)** is a frontend library/framework that allows you to build web apps just by focusing on HTML, meaning that the logic/functionality that you would usually write in JavaScript, you can now express via HTML.

You can find the app that I am going to describe in this article on GitHub [here](https://github.com/Guseyn/simple-oauth-app).  You can also watch the demo [here](http://www.youtube.com/watch?feature=player_embedded&v=lOf0NkNtWzI).

Let's start with following page:

<img src="/image/ehtml-blog-app-1.png?v=fde14c79" alt="main-page">

This is an index page, let's take a look at the source:

```html
&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" lang="en"&gt;
  &lt;head&gt;
    &lt;title&gt;Blog App&lt;/title&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;meta name="author" content="Guseyn"&gt;
    &lt;link rel="shortcut icon" type="image/png" href="/image/favicon.png?v=fde14c79"&gt;
    &lt;link rel="stylesheet" href="/css/normalize.css?v=fde14c79" type="text/css"&gt;
    &lt;link rel="stylesheet" href="/css/main.css?v=23840f6c" type="text/css"&gt;
    &lt;script src="/js/ehtml.js" type="text/javascript"&gt;&lt;/script&gt;
  &lt;/head&gt;

  &lt;body class="main"&gt;
    &lt;div class="base"&gt;
      
      &lt;e-html data-src="/html/add-post.html"&gt;&lt;/e-html&gt;
      &lt;e-turbolink class="page-link" data-href="/html/posts.html?page=0&size=3"&gt;
        Show All Posts
      &lt;/e-turbolink&gt;

    &lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

There are few things that's worth attention:

1. We load our ehtml lib just via `&lt;script&gt;` tag.

2. We're using `e-html` tag to load snippet of some of other html code. More info on this tag you can find [here](https://github.com/Guseyn/EHTML#supported-elements).

3. We're using `e-turbolink` tag to redirect to the the list of all posts. More info on this tag you can find [here](https://github.com/Guseyn/EHTML#supported-elements)

Let's take a look at the form that we're a going to build:

```html
&lt;div class="blog-box"&gt;
  
  &lt;div class="title"&gt;Add new post&lt;/div&gt;

  &lt;e-form
    data-validation-error-message="Enter correct data into the form, please"
    data-validation-error-class-for-message-box="form-message-error"&gt;
    &lt;div class="input-label"&gt;Your email&lt;/div&gt;
    &lt;input
      type="email" 
      name="userEmail"
      required
      data-validation-pattern="email"
      data-validation-bad-format-error-message="This is not proper email address"
      data-validation-absence-error-message="Email is required"
      data-validation-error-class-for-element="elm-error"
      data-validation-error-class-for-message-box="message-error"&gt;

    &lt;div class="input-label"&gt;Date&lt;/div&gt;
    &lt;input
      type="date"
      name="date"
      required
      data-validation-pattern="date"
      data-validation-absence-error-message="Post date is required"
      data-validation-error-class-for-element="elm-error"
      data-validation-error-class-for-message-box="message-error"&gt;

    &lt;div class="input-label"&gt;Title&lt;/div&gt;
    &lt;input
      type="text"
      name="title"
      required
      data-validation-error-class-for-element="elm-error"
      data-validation-error-class-for-message-box="message-error"&gt;

    &lt;div class="input-label"&gt;Content&lt;/div&gt;
    &lt;textarea
      name="content"
      required
      data-validation-error-class-for-element="elm-error"
      data-validation-error-class-for-message-box="message-error"&gt;&lt;/textarea&gt;

    &lt;button
      data-request-url="/post/new/"
      data-request-method="POST"
      data-ajax-icon=".ajax-icon"
      onclick="this.form.submit(this)"
      data-response-name="response"
      data-actions-on-response="turboRedirect('/html/post.html?id=${response.body.id}')"&gt;
      POST
    &lt;/button&gt;
    &lt;img class="ajax-icon" src="/images/ajax-icon.svg"/&gt;
  &lt;/e-form&gt;

&lt;/div&gt;
```

Here we're declaring `e-form` tag with different validation messages(for the whole form and its input fields) and also css class names for them:

```css
.elm-error {
  border: 1px solid red;
}

.message-error {
  color: red;
}

.form-message-error {
  text-align: center;
  color: red;
  font-family: sans-serif;
}
```

The main difference between default form and `e-form` is that we send payload to the server as JSON. Attribute `name` of each input field is used as a key in the `JSON` payload. We can add attributes like `require` and `data-validation-pattern` for frontend validation.

In the button in the form you can specify details of the endpoint that waits for the payload. Here you specify url, type of the request, you can even specify the selector for the ajax loading icon. Another interesting details is attribute  `data-response-name`. Here you specify the name of the response, which consists of `body`, `headers` and `statusCode`. And then in the `data-actions-on-response` you can specify an action for the response. Here we reidrect to the new post. More information you can find on actions on response you can find [here](https://github.com/Guseyn/EHTML#supported-actions-on-response).

When you open a post, you would see something like this:

&lt;img src="/image/ehtml-blog-app-2.png?v=fde14c79" alt="post-page"&gt;

Let's see how we can build the page above:

```html
&lt;body class="main"&gt;
  &lt;div class="base"&gt;
    
    &lt;template is="e-page-with-url" data-url-pattern="/html/post.html?{id}"&gt;
      
      &lt;div class="blog-box"&gt;
        
        &lt;e-json 
          data-src="/post?id=${urlParams.id}" 
          data-ajax-icon="#post-ajax-icon"
          data-response-name="postResponse"
          data-actions-on-response="mapToTemplate('${postResponse}', '#post-template');"&gt;
          &lt;img class="ajax-icon" id="post-ajax-icon" src="/images/ajax-icon.svg"/&gt;

          &lt;template id="post-template" data-object-name="postResponse"&gt;

            &lt;template is="e-if" data-condition-to-display="${postResponse.statusCode === 404}"&gt;
              &lt;div class="not-found"&gt;Post Not Found&lt;/div&gt;
            &lt;/template&gt;

            &lt;template is="e-if" data-condition-to-display="
              ${postResponse.statusCode === 200}
            "&gt;

              &lt;div class="post-box"&gt;
                &lt;div class="title" data-text="${postResponse.body.title}"&gt;&lt;/div&gt;
                &lt;div class="user-email" data-text="${postResponse.body.userEmail}"&gt;&lt;/div&gt;
                &lt;div class="date" data-text="${postResponse.body.date}"&gt;&lt;/div&gt;
                &lt;div class="content" data-text="${postResponse.body.content}"&gt;&lt;/div&gt;
              &lt;/div&gt;

              &lt;div class="comments-box"&gt;
                
                &lt;b&gt;Comments:&lt;/b&gt;
                &lt;template is="e-if" data-condition-to-display="
                  ${postResponse.body.comments.length === 0}
                "&gt;
                  &lt;div id="no-comments-message"&gt;No Comments yet. Be the first to comment.&lt;/div&gt;
                &lt;/template&gt;

                &lt;template is="e-if" data-condition-to-display="
                  ${postResponse.body.comments.length !== 0}
                "&gt;

                  &lt;template is="e-for-each"
                    data-list-to-iterate="${postResponse.body.comments}"
                    data-item-name="comment"
                  &gt;
                    &lt;div class="comment-box"&gt;
                      &lt;div class="user-email" data-text="${comment.userEmail}"&gt;&lt;/div&gt; 
                      &lt;div class="comment-content" data-text="${comment.content}"&gt;&lt;/div&gt; 
                    &lt;/div&gt;
                  &lt;/template&gt;

                &lt;/template&gt;
                  
                &lt;template id="comment-template" is="e-reusable" data-object-name="comment"&gt;
                  &lt;div class="comment-box"&gt;
                    &lt;div class="user-email" data-text="${comment.userEmail}"&gt;&lt;/div&gt; 
                    &lt;div class="comment-content" data-text="${comment.content}"&gt;&lt;/div&gt; 
                  &lt;/div&gt;
                &lt;/template&gt;

                &lt;e-form 
                  style="margin-top: 2em;"
                  data-validation-error-message="Enter correct data into the form, please"
                  data-validation-error-class-for-message-box="form-message-error"&gt;
                  &lt;div class="input-label"&gt;Your email&lt;/div&gt;
                  &lt;input
                    id="email-input"
                    type="email" 
                    name="userEmail"
                    required
                    data-validation-pattern="email"
                    data-validation-bad-format-error-message="This is not proper email address"
                    data-validation-absence-error-message="Email is required"
                    data-validation-error-class-for-element="elm-error"
                    data-validation-error-class-for-message-box="message-error"&gt;

                  &lt;div class="input-label"&gt;Comment&lt;/div&gt;
                  &lt;textarea 
                    id="comment-text" 
                    required
                    data-validation-error-class-for-element="elm-error"
                    data-validation-error-class-for-message-box="message-error"
                    name="content"&gt;&lt;/textarea&gt;

                  &lt;button
                    data-request-url="/comment/new?postId=${postResponse.body.id}"
                    data-request-method="POST"
                    data-ajax-icon="#comment-ajax-icon"
                    data-response-name="response"
                    onclick="this.form.submit(this)"
                    data-actions-on-response="
                      mapToTemplate('${response.body}', '#comment-template');
                      changeValueOf('#email-input', '');
                      changeValueOf('#comment-text', '');
                      hideElms('#no-comments-message');
                    "
                  &gt;
                    Send
                  &lt;/button&gt;
                  &lt;img class="ajax-icon" id="comment-ajax-icon" src="/images/ajax-icon.svg"/&gt;
                &lt;/e-form&gt;

              &lt;/div&gt;

            &lt;/template&gt;

          &lt;/template&gt;

        &lt;/e-json&gt;

      &lt;/div&gt;

      &lt;e-turbolink class="page-link" data-href="/html/posts.html?page=0&size=3"&gt;
        Go To All Posts
      &lt;/e-turbolink&gt;

      &lt;e-turbolink class="page-link" data-href="/html/index.html"&gt;
        Add New One
      &lt;/e-turbolink&gt;

    &lt;/template&gt;

  &lt;/div&gt;
&lt;/body&gt;
```

You can see a lot of different elements in the page above, let go through them one by one.

The template with `is="e-page-with-url"` allows us to parse url parameters on a page, and then we can access them via `${urlParams.keyName}` in the attributes of other elements. Since it's a template, it will be rendered with mapped url params once it parsed the url.

Inside of the `e-page-with-url` template we got `e-json`. This element allows us to fetch JSON response, and as you see we're mapping that response on specified template via method `mapToTemplate`.

Inside of `e-json` you can see first `e-if` template, it gets rendered if only satisfies the condition in `data-condition-to-display` attribute. There we're checking whether the status code of the response is 400, so we can say to the user that the requested post is missing.

Another `e-if` template gets activated when status code is 200. There we got following snippet:

```
&lt;div class="post-box"&gt;
  &lt;div class="title" data-text="${postResponse.body.title}"&gt;&lt;/div&gt;
  &lt;div class="user-email" data-text="${postResponse.body.userEmail}"&gt;&lt;/div&gt;
  &lt;div class="date" data-text="${postResponse.body.date}"&gt;&lt;/div&gt;
  &lt;div class="content" data-text="${postResponse.body.content}"&gt;&lt;/div&gt;
&lt;/div&gt;
```

As you see we can map the details of the post on the HTML element.

Like for the posts, we can create a form for the comments via `e-form`. There we're also checking whether the post does not have aany comments. In case when a post has comments, we displaying each of them via `e-for-each`. By using `data-list-to-iterate` and `data-item-name` we can map each element of the list on the template. When you add a comment, it will be mapped to the template with `e-reusable` attribute. It means that we can use this template again, and it does not get destroyed like in other cases before.

This is how list of comments looks like:

&lt;img src="/image/ehtml-blog-app-3.png?v=fde14c79" alt="main-page"&gt;

Finally, let's explore how we can build a page with list of posts with pagination:

&lt;img src="/image/ehtml-blog-app-4.png?v=fde14c79" alt="main-page"&gt;

Let's take a look at the source:

```html
&lt;body class="main"&gt;
  &lt;div class="base"&gt;
    
    &lt;template is="e-page-with-url" data-url-pattern="/html/posts.html?{page}&{size}"&gt;
      &lt;div class="blog-box"&gt;

        &lt;e-json 
          data-src="/posts?page=${urlParams.page}&size=${urlParams.size}"
          data-ajax-icon="#posts-ajax-icon"
          data-response-name="postsResponse"
          data-actions-on-response="mapToTemplate('${postsResponse}', '#posts-template');"&gt;
          &lt;img class="ajax-icon" id="posts-ajax-icon" src="/images/ajax-icon.svg"/&gt;
          
          &lt;template id="posts-template" data-object-name="postsResponse"&gt;
            
            &lt;template is="e-if" data-condition-to-display="
              ${postsResponse.body.posts.length === 0}
            "&gt;
              &lt;div class="no-content-message"&gt;No posts yet&lt;/div&gt;
            &lt;/template&gt;
            
            &lt;template is="e-if" data-condition-to-display="
              ${postsResponse.body.posts.length !== 0}
            "&gt;

              &lt;template is="e-for-each"
                data-list-to-iterate="postsResponse.body.posts"
                data-item-name="post"&gt;
                
                &lt;div class="post-box"&gt;
                  &lt;div class="title"&gt;
                    &lt;e-turbolink 
                      data-text="${post.title}"
                      data-href="/html/post.html?id=${post.id}"&gt;    
                    &lt;/e-turbolink&gt;
                  &lt;/div&gt;
                  &lt;div class="user-email" data-text="${post.userEmail}"&gt;&lt;/div&gt;
                  &lt;div class="date" data-text="${post.date}"&gt;&lt;/div&gt;
                  &lt;div class="content" data-text="${post.content}"&gt;&lt;/div&gt;
                &lt;/div&gt;

              &lt;/template&gt;
              
              &lt;template is="e-if" data-condition-to-display="
                ${urlParams.page * 1 &gt; 0 }"
              &gt;

                &lt;e-turbolink class="page-link"
                  data-href="/html/posts.html?page=${urlParams.page * 1 - 1}&size=${urlParams.size}"&gt;
                  &lt;&lt; Show prev. page
                &lt;/e-turbolink&gt;

              &lt;/template&gt;

              &lt;template is="e-if"
                data-condition-to-display="${!postsResponse.body.lastPage}"&gt;

                &lt;e-turbolink class="page-link"
                  data-href="/html/posts.html?page=${urlParams.page * 1 + 1}&size=${urlParams.size}"&gt;
                  Show next. page &gt;&gt;
                &lt;/e-turbolink&gt;

              &lt;/template&gt;

            &lt;/template&gt;

            &lt;e-turbolink class="page-link" data-href="/html/index.html"&gt;
              Add new post
            &lt;/e-turbolink&gt;

          &lt;/template&gt;

        &lt;/e-json&gt;
        
      &lt;/div&gt;
    &lt;/template&gt;
    
  &lt;/div&gt;
&lt;/body&gt;
```

You can notice that we parse our url with pagination params: `size` and `page` via attribute `data-url-pattern="/html/posts.html?{page}&{size}"`. This way we can use those params in `e-json` to get reqested articles and also we can detect whether we should put the link to the next page.

So, it's quite straightforward and declarative approach how you can encapsulate the logic right into the HTML.

<br>

[Reddit Comments](https://www.reddit.com/user/gyen/comments/11lbupc/blog_app_in_ehtml/) / [HN Comments](https://news.ycombinator.com/newest) / [Medium Comments](https://medium.com/@guseynism/blog-app-in-ehtml-93a0aacaed1d)

<div class="refs">References</div>
* [Blog app on GitHub](https://github.com/Guseyn/ehtml-simple-blog-app)
* [EHTML](https://github.com/Guseyn/EHTML)


