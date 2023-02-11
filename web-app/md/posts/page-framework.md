# Page: Declarative Web Framework for Node.js

<div class="date">1 October 2018</div>

<img class="article-logo" style="width: 150px; height: 117.4px;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1s%0D%0AbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRw%0D%0AOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iMjMwIiBoZWlnaHQ9IjE4MCI+PGRlZnMgaWQ9IlN2%0D%0AZ2pzRGVmczEwMDEiPjwvZGVmcz48c3ZnIGlkPSJTdmdqc1N2ZzEwMDIiIHdpZHRoPSIyIiBoZWln%0D%0AaHQ9IjAiIGZvY3VzYWJsZT0iZmFsc2UiIHN0eWxlPSJvdmVyZmxvdzogaGlkZGVuOyB0b3A6IC0x%0D%0AMDAlOyBsZWZ0OiAtMTAwJTsgcG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwIj48cG9seWxp%0D%0AbmUgaWQ9IlN2Z2pzUG9seWxpbmUxMDAzIiBwb2ludHM9IjAsMCI+PC9wb2x5bGluZT48cGF0aCBp%0D%0AZD0iU3ZnanNQYXRoMTAwNCIgZD0iTTEwIDMwQzEwIDMwIDEyMCAxMjAgMTcwIDkwTC01MCAyMDAg%0D%0AIj48L3BhdGg+PC9zdmc+PHBhdGggaWQ9IlN2Z2pzUGF0aDEwMDYiIGQ9Ik03MCAxMEM3MCAxMCAx%0D%0AODAgMTAwIDIzMCA3MEwxMCAxODAgIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWpvaW49InJvdW5k%0D%0AIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZT0iIzQ1NDU0NSIgc3Ryb2tlLXdpZHRoPSIx%0D%0AIj48L3BhdGg+PHRleHQgaWQ9IlN2Z2pzVGV4dDEwMDciIGZvbnQtZmFtaWx5PSJMdWNpZGEgR3Jh%0D%0AbmRlIiB4PSIzOCIgeT0iMTQ3LjEwMTU2MjUiIHRyYW5zZm9ybT0ibWF0cml4KDAuODk4Nzk0MDQ2%0D%0AMjk5MTY3LC0wLjQzODM3MTE0Njc4OTA3NzQsMC40MzgzNzExNDY3ODkwNzc0LDAuODk4Nzk0MDQ2%0D%0AMjk5MTY3LC01Ni4wODI3MjcwODE2NDI4MTUsMzguODY4MDgzMTgxODAxNDcpIiBmb250LXNpemU9%0D%0AIjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmYW1pbHk9Ikx1Y2lkYSBHcmFuZGUiIHNpemU9IjI2%0D%0AIiBhbmNob3I9Im1pZGRsZSIgc3ZnanM6ZGF0YT0ieyZxdW90O2xlYWRpbmcmcXVvdDs6JnF1b3Q7%0D%0AMS41ZW0mcXVvdDt9Ij48dHNwYW4gaWQ9IlN2Z2pzVHNwYW4xMDA4IiBmaWxsPSIjYzQwMjMzIj5Q%0D%0AYWdlPC90c3Bhbj48L3RleHQ+PC9zdmc+">
I am glad to introduce my web framework [Page](https://github.com/Guseyn/page). It can be described as a base for any applications on top of it with server and client in Node.js. It provides a lot of features and common scenarios for using web. It's completely based on the [Async Tree Pattern](/../../pdf/Async_Tree_Pattern.pdf) that allows you to customize Page in any way you want, you can even throw it away and build other base core for your application. In another words, **Page** is just an example of how you can build your application using libraries that are based on [cutie](https://github.com/Guseyn/cutie). In this article, I will list conceptual points why you should thnk about moving to such framework as **Page**.

**Page Is Not a Regular Framework.**
Almost every framework is made with assumption that we live in ideal world, but it's very far from the truth. It's not possible to build something big and stable using magic, which every framework is based on. Meanwhile, **Page** allows you to control the whole behaviour of your application and apply new changes in a explicit way.

**It's Not Easy to Start Quickly.**
 First of all you need to get acquainted with [Async Tree Pattern](/../../pdf/Async_Tree_Pattern.pdf) and it's [implementation](https://github.com/Guseyn/cutie). It allows to build everything using declarative approach. Also you must know how Node.js works and it's important to understand how non-blockinng i/o works there.

**But It's Very Easy to Continue.**
Ones you've learnt how to use [Async Tree Pattern](/../../pdf/Async_Tree_Pattern.pdf), libraries that are based on cutie and libraries for **Page**, your life is never will be like before. You'll able to intoduce new changes into your code extremely fast and painless(unlike in frameworks).

**Small Core.**
**Page** is almost based on little pieces from different libraries that can be easily combined with each other for building appication. It makes **Page** lightweight and easily extensible.

If you're interested to learn more about **Page**, [here](https://github.com/Guseyn/page/blob/master/README.md) is the documentation. 
