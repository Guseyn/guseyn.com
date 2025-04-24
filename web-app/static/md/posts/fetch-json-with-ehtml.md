# Fetching and Mapping JSON Just by Using HTML
<div class="date">19 March 2023</div>

I love HTML. I love it more than anything else in frontend development. It's simple, it's fully declarative, it's powerful and most importantly it's a foundation of any web application. You can do whatever you want with server side rendering or with JavaScript magic on the frotend, but at the end it's always the HTML that a user sees and interacts with.

In HTML, there are different elements responsible for representing different resources, like `<img>`, `<a>`, `<script>`, `<link>`. Some of them fetch some resources or data from the server, while others can just point or refer to some resources.

For example, with `<img>` you can load images and present them to the user:

`<img src="/path/to/image.png">`

I always felt that we can do the same for more complex type of resource, like for example `JSON`. It's quite common that we just need to fetch some data in **JSON** format and map it on some HTML template. You can achieve this by fetching data using AJAX in JavaScript and build elements with mapped data from the response. Or you can use server rendering that combines and generates HTML with mapped data.

Imagine that you have no control over the server, for example, when you need to fetch data from a third-party service or external API. In such cases, you may not want to create a proxy on your server or bring a frontend framework with dozens of dependencies into your project. Additionally, repeatedly writing the same AJAX requests in JavaScript can be tedious.

It's not that I'm against server-side rendering or JavaScript (which is the best scripting language, in my opinion). Rather, I believe that we should strive for simplicity. HTML is an excellent way to achieve this simplicity.

As an example, consider an open API like `restcountries.com`. If we make a request to this URL - `https://restcountries.com/v3.1/name/cyprus` - we will receive a response in JSON format:

```json
[
   {
      "name":{
         "common":"Cyprus",
         "official":"Republic of Cyprus",
         "nativeName":{
            "ell":{
               "official":"Δημοκρατία της Κύπρος",
               "common":"Κύπρος"
            },
            "tur":{
               "official":"Kıbrıs Cumhuriyeti",
               "common":"Kıbrıs"
            }
         }
      },
      "currencies":{
         "EUR":{
            "name":"Euro",
            "symbol":"€"
         }
      },
      ...
      "capital":[
         "Nicosia"
      ],
      "region":"Europe",
      "subregion":"Southern Europe",
      "languages":{
         "ell":"Greek",
         "tur":"Turkish"
      },
      "population":1207361,
      "timezones":[
         "UTC+02:00"
      ],
      "continents":[
         "Europe"
      ],
      "flags":{
         "png":"https://flagcdn.com/w320/cy.png",
         "svg":"https://flagcdn.com/cy.svg",
         "alt":"The flag of Cyprus has a white field, at the center of which is a copper-colored silhouette of the Island of Cyprus above two green olive branches crossed at the stem."
      }
   }
]
```

Imagine if we could do something like this:

```html
<template is="e-json" data-src="https://restcountries.com/v3.1/name/cyprus" data-object-name="response">
  <h3>Information about <span data-text="${response.body[0].name.official}:"></span></h3>
  <p>
    <span>Capital is </span><b data-text="${response.body[0].capital[0]}"></b><br>
    <span>Localted in </span><b data-text="${response.body[0].continents[0]}"></b><br>
    <span>Localted more specifically in </span><b data-text="${response.body[0].subregion}"></b><br>
    <span>Flag looks like </span><img class="flag" src="${response.body[0].flags.svg}"><br>
    <span>Timezones are </span><b data-text="${response.body[0].timezones.join(', ')}"></b><br>
    <span>Population is </span><b data-text="${response.body[0].population}"></b><br>
    <span>Languages are </span><b data-text="${Object.values(response.body[0].languages).join(', ')}"></b><br>
    <span>Currencies are </span><b data-text="${Object.keys(response.body[0].currencies).join(', ')}"></b><br>
  </p>
</template>
```

With some sprinkle of css, the page can look like this:

<img src="https://cdn.guseyn.com/image/info-on-cyprus.png?v=fde14c79">

I have good news for you - you can do this, and not only. [EHTML](https://github.com/Guseyn/EHTML) provides custom elements that you can put on HTML page for different purposes and use cases. The main idea and goal of this library is to provide a convenient way to get rid of JavaScript code on the client side as much as it's possible for basic and routine stuff.

As you see, just by declaring `template` tag with indicator `e-json` and some attributes where you specify source of JSON and mapping object name, you can pull JSON and map it inside of template via `data-text` attribute, where you can also apply functions for data-structures. **EHTML** also allows you to loop objects, to put conditions and many other things.

<br>

[Reddit Comments](https://www.reddit.com/user/gyen/comments/11v423g/fetching_and_mapping_json_just_by_using_html/) / [Medium Comments](https://medium.com/@guseynism/fetching-and-mapping-json-just-by-using-html-b8bcecade82c)

<div class="refs">References</div>
* [Full example](https://github.com/Guseyn/restcountries-ehtml)
* [EHTML](https://github.com/Guseyn)

