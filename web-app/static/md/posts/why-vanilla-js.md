# Why Vanilla JS
<div class="date">13 July 2026</div>

I would like to share a little bit of my journey and what I have been doing for the last year. This story is dedicated to people who are in doubt, have frustration and annoyance from dealing with artificial complexity in web technologies on a daily basis.

For the last year, I have been working on a web application [instruxmusic.com](http://instruxmusic.com). It's a tool for music schools and independent instructors to run their business more efficiently. 

Meaning they can schedule lessons, they can bill their students and have automated invoicing, they can teach online via video chat. 

The video chat also includes a message box with file sharing (for example sheet music files); and there are other music related tools in the video room like metronome and magnifying glass to see precisely the student's hand technique. 

There is also a brand page builder that allows music studios to build their presence and have their custom landing page with their logo, custom brand colors and general information about services they provide and introduction of their instructors. In that landing page, there is also a booking system where their potential clients can book demo lessons and master classes. 

And of course, there is a dashboard with stats and organization management tools, a music school administrator can easily invite instructors and students. All members of the studio have access to the message board and they can write emails to each other to share news and just communicate.

The reason why I list all those features is just to show you that this is rather a complex web application. It's not super duper complex, but it still requires tons of effort and dedication to build. You can watch the [demo here](https://guseyn.com/mp4/desktop.mp4) and judge for yourself. And this whole application I decided to build entirely in vanilla JavaScript using **Web Components** (or how they say, custom HTML elements). And to explain my motivation and reasoning, I would like to discuss a few things that really bother me and things that I hate.

## Framework Market

If you want to build a frontend for your web application, you have tons of options. Right now, I believe there are four major players: **React**, **Angular**, **Vue** and **Svelte**. I don't have exact stats, but this is my feeling when I search for a job on LinkedIn, for example. React is miles ahead of its competitors by the way, it probably captures over 95% of all jobs, which is insane.

There are a few common things that those frameworks share. First thing is that they all require a build step or rather whole build pipeline where you can do many things like bundling, minifying, transpiling and optimizing artifacts which can be deployed. I am not saying it's good or bad, I am just saying this is how it is now.

Another thing is that they all require or encourage using TypeScript. Although Svelte for example is rewritten completely in JavaScript (with JS docs and type definitions), I still think that everyone is still using TypeScript with Svelte.

And the third thing that I believe all those frameworks share is introduction of artificial complexity.

## Artificial Complexity

Why am I saying this? And what do I mean by this? 

I would like to address my point on the example of such concept as "reactivity". I think this single concept ruined and brainwashed a whole generation of developers.

The idea of reactivity came from or was popularized by Angular.js. Yes, the very first version of Angular. In general, people from Google love reactive programming. You can watch [this video](https://www.youtube.com/watch?v=khk_vEF95Jk), where Miško Hevery was explaining the idea of changing view just by changing state. In his talk, he stated that the majority of frontend code is DOM manipulations and a lot of routine things and boilerplate that is related to that. And his idea was to delegate this work to the framework, so that you can focus on other things like business logic.

This idea evolved and became so popular that developers at Facebook invented React. And it's a strong name, isn't it? It gives speed and power. It gives something dynamic, positive and full of life.

If you look at how native web technologies (HTML, CSS, JavaScript) are designed, you will see that they are the exact opposite of what those frameworks offer and suggest.

While native web stack is dynamic, in frameworks you need to build and preprocess stuff. While in native web stack everything is around event listeners and manual DOM manipulations, in frameworks you are not allowed directly to touch DOM (it's considered an anti-pattern and code smell) and you need to wrap event listeners in things like `useEffect` for them to work properly. While in native web stack you can use global state and directly manipulate it on a page, in frameworks everything is isolated on the component level and requires you to use certain abstractions or even third-party state management tools to do the job.

I tend to believe if something requires from you more lines of code and more abstractions in an abstract framework to achieve than in native technology, then maybe this framework does not really make your life easier. Maybe it's not really well thought technology and maybe it's reinventing things that are already supported by default.

Do I believe that DOM manipulations can be simplified and require less code? Yes! But do I believe that you have to give your control for that? No! We need simple solutions, not lack of control.

And they try to take control from you:

1. NO, YOU CANNOT MANIPULATE DOM DIRECTLY, ONLY WE CAN DO THAT INSIDE OF OUR FRAMEWORK.
2. NO, YOU CANNOT JUST ATTACH EVENT LISTENER TO WINDOW OBJECT. YOU NEED TO WRAP IT.
3. NO, YOU CANNOT JUST USE GLOBAL STATE. USE THIRD-PARTY LIBRARY WITH FANCY FUNCTIONAL DESIGN.
4. NO, YOU CANNOT USE NATIVE WEB COMPONENTS. YOU MUST USE HOOKS AND OUR LIFECYCLE WE INVENTED.
5. NO, YOU CANNOT USE IMPORT MAP. YOU MUST USE A BUILD TOOL AND PREPROCESSORS.

## The browser is already the framework.

This is my main point. The browser engine is a huge and complex piece of software that handles so much for you that the only thing you really need is just to write dynamic files with HTML, CSS and JavaScript and a browser engine glues everything for you. It supports caching, it allows you to type in input fields and allows to submit forms. It allows page navigation and tons of other things.

In recent years, there are also so much advancements in HTML, CSS and JavaScript. Don't get me wrong. Are these technologies perfect? No, far from that. However, instead of inventing good design patterns and developing a culture of writing good structured code and JUST DO THE WORK, we invented so much shit just not to write HTML, CSS and JavaScript. 

Server Side Rendering is also no better, because while they can do certain things in more straightforward way, they break browser behaviour and again try to reinvent things that are already supported just to somehow support interaction on client side.

For HTML, we invented so many templating languages: EJS, Pug, Handlebars, Mustache, Nunjucks, Django Templates, Jinja2, Mako, Chameleon, Blade, Twig, Smarty, ERB, Haml, Slim, Thymeleaf, Apache FreeMarker, JSP, html/template, Pongo2, Templ, Tera, MiniJinja, Askama, Maud.

For CSS we invented so many preprocessors: Sass, SCSS, Less, Stylus, PostCSS, Stylable, Myth, Crass, Rework, Clay.

And of course everyone hates JavaScript: TypeScript, CoffeeScript, Babel, PureScript, ClojureScript, ReasonML, ReScript, Elm, Dart, Flow, AssemblyScript, GWT (Google Web Toolkit), Opal, Nim (JS backend), Haxe, Sweet.js. 

While some of the technologies listed made some sense in the past, I don't think it's the case nowadays.

I believe **Web Components** are good enough, if you have the right attitude and mindset and you try to organize your codebase. I think you can develop quite complex and robust applications and be productive.

## Vanilla JavaScript Does Not Have a Structure.

This is the main argument that you can hear from opponents of the idea of using vanilla JavaScript. It does not have structure, it does not scale, it is messy, etc.

Sure, it is. You know why? Because for the last 20 years, instead of solving real issues and making good decisions on how to simplify code, we just invented so many abstractions, languages and tools just to avoid the problem instead of solving it.

YOU WILL JUST INVENT YOUR OWN FRAMEWORK!!!

Yes, I will. And actually I did. Two, actually. First one is [EHTML](https://e-html.org/) which basically allows to use HTML as templating language. Instead of inventing virtual DOMs, reactive engines, or build pipelines, EHTML activates plain HTML once and then reacts only to real DOM insertions—doing the minimum work needed, exactly when it’s needed. And it's 100% compatible with **Web Components**, meaning that you declare elements exactly how you would natively. 

And another tool I built is [e-ui](https://github.com/Guseyn/e-ui). It provides a design system (CSS) and interactive custom elements that work alongside EHTML. It has such elements like toasts, tooltips, dialogs, file uploaders, chips, typography, accessibility elements and many many others.

You may ask, what's the difference between my frameworks and the ones that exist out there? Very simple, I don't reinvent solutions, I solve real problems:
1. HTML does not have real good templating and requires DOM manipulations. I added support for templating and API (`mapToTemplate` function) to solve these issues.
2. Forms don't work natively with JSON. I added this feature. I also added support for nested structures in forms like array of objects. And I added support for validations right into HTML
3. Multi-page applications are slow to load and navigate. I added HTML caching for main parts of the page which makes multi-page applications feel like single-page applications.
4. JavaScript is difficult to organize. I added support for import maps.
5. So many more problems solved...

And all those problems are solved with native technology without introducing new languages, build steps, transpilers and preprocessors.

And you know what? It scales. It scales beautifully. I managed to organize my code in a way that most of it just HTML, then I have custom web components and literally a couple of JavaScript files with utility functions.

And honestly, you don't need AI to build with this approach or at very least you definitely don't have to spend so much tokens.
 
Here is some stats

```md
JavaScript - 47.4% 

HTML - 38.7% 

CSS - 10.5% 

Shell - 2.9% 

Other - 0.5%
```

And here is even more stats

```md
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                     221           2947           1122          24316
HTML                            54            342            141          17641
CSS                             14           1231            472           7935
SQL                            144            161            145           1283
SVG                            147             24              2            346
JSON                             4              0              0            233
XML                              1              0              0             29
Text                             1              1              0              8
-------------------------------------------------------------------------------
SUM:                           586           4706           1882          51791
-------------------------------------------------------------------------------
```

HTML is almost 40%, considering the fact that my backend code is also vanilla js.

Amout of js code is really really not that big. Considering again it's ALL the code: Backend + Frontend + Frameworks (!!).
Just think about it. How much you can achieve with so little.

And if specifically talk about frontend:

```md
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
HTML                            54            342            141          17709
JavaScript                      95           1329            782           9120
CSS                             14           1236            472           7986
-------------------------------------------------------------------------------
SUM:                           163           2907           1395          34815
-------------------------------------------------------------------------------
```

HTML is **50%**. Half of my code is HTML. CSS is **20%**. And JavaScript is around **30%**. Can you imagine that the amount of CSS and JavaScript is almost the same? And can you imagine that with just **9k** lines of JavaSctipt (frameworks included!!!) you can build whole SaaS product?

So, please don't tell me Vanilla JavaScript does not scale.

## Conclusion 

If you have read till this moment, I would like to thank you for reading. I hope that this article gave something to think about and maybe even reconsider how you build your applications.

[Subscribe to my newsletter](https://guseyn.com/html/in-touch.html) to see more posts and updates.

**P.S.** I am looking for a new contract — see my [profile](https://guseyn.com/html/work-with-me.html).
