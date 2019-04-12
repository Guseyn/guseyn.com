# Convenient Test Executor for Node.js

<div class="date">6 May 2018</div>

<div class="tags">
  <a class="tag" href="/../tags/library?v={version}">library</a>
  <a class="tag" href="/../tags/node?v={version}">node</a>
  <a class="tag" href="/../tags/asyncobjects?v={version}">async objects</a>
</div>

<img class="article-logo" style="width: 100px; height: 100px" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1s%0D%0AbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRw%0D%0AOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iMTI1IiBoZWlnaHQ9IjE1MCI+PGRlZnMgaWQ9IlN2%0D%0AZ2pzRGVmczEwMDEiPjwvZGVmcz48c3ZnIGlkPSJTdmdqc1N2ZzEwMDIiIHdpZHRoPSIyIiBoZWln%0D%0AaHQ9IjAiIGZvY3VzYWJsZT0iZmFsc2UiIHN0eWxlPSJvdmVyZmxvdzogaGlkZGVuOyB0b3A6IC0x%0D%0AMDAlOyBsZWZ0OiAtMTAwJTsgcG9zaXRpb246IGFic29sdXRlOyBvcGFjaXR5OiAwIj48cG9seWxp%0D%0AbmUgaWQ9IlN2Z2pzUG9seWxpbmUxMDAzIiBwb2ludHM9IjAsMCI+PC9wb2x5bGluZT48cGF0aCBp%0D%0AZD0iU3ZnanNQYXRoMTAwNCIgZD0iTTAgMCAiPjwvcGF0aD48L3N2Zz48bGluZSBpZD0iU3ZnanNM%0D%0AaW5lMTAwNiIgeDE9IjE1IiB5MT0iMTUiIHgyPSIxMDAiIHkyPSIxNSIgc3Ryb2tlLWxpbmVjYXA9%0D%0AInJvdW5kIiBzdHJva2U9IiM3ZmJmN2YiIHN0cm9rZS13aWR0aD0iMTAiPjwvbGluZT48bGluZSBp%0D%0AZD0iU3ZnanNMaW5lMTAwNyIgeDE9IjE1IiB5MT0iMzAiIHgyPSI5MCIgeTI9IjMwIiBzdHJva2Ut%0D%0AbGluZWNhcD0icm91bmQiIHN0cm9rZT0iIzdmYmY3ZiIgc3Ryb2tlLXdpZHRoPSIxMCI+PC9saW5l%0D%0APjxsaW5lIGlkPSJTdmdqc0xpbmUxMDA4IiB4MT0iMTUiIHkxPSI0NSIgeDI9IjExMCIgeTI9IjQ1%0D%0AIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZT0iIzdmYmY3ZiIgc3Ryb2tlLXdpZHRoPSIx%0D%0AMCI+PC9saW5lPjxsaW5lIGlkPSJTdmdqc0xpbmUxMDA5IiB4MT0iMTUiIHkxPSI2MCIgeDI9IjEw%0D%0AMCIgeTI9IjYwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZT0iI2ZmNjY2NiIgc3Ryb2tl%0D%0ALXdpZHRoPSIxMCI+PC9saW5lPjxsaW5lIGlkPSJTdmdqc0xpbmUxMDEwIiB4MT0iMTUiIHkxPSI3%0D%0ANSIgeDI9IjkwIiB5Mj0iNzUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlPSIjN2ZiZjdm%0D%0AIiBzdHJva2Utd2lkdGg9IjEwIj48L2xpbmU+PGxpbmUgaWQ9IlN2Z2pzTGluZTEwMTEiIHgxPSIx%0D%0ANSIgeTE9IjkwIiB4Mj0iODAiIHkyPSI5MCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2U9%0D%0AIiNmZjY2NjYiIHN0cm9rZS13aWR0aD0iMTAiPjwvbGluZT48bGluZSBpZD0iU3ZnanNMaW5lMTAx%0D%0AMiIgeDE9IjE1IiB5MT0iMTA1IiB4Mj0iOTAiIHkyPSIxMDUiIHN0cm9rZS1saW5lY2FwPSJyb3Vu%0D%0AZCIgc3Ryb2tlPSIjN2ZiZjdmIiBzdHJva2Utd2lkdGg9IjEwIj48L2xpbmU+PGxpbmUgaWQ9IlN2%0D%0AZ2pzTGluZTEwMTMiIHgxPSIxNSIgeTE9IjEyMCIgeDI9IjExMCIgeTI9IjEyMCIgc3Ryb2tlLWxp%0D%0AbmVjYXA9InJvdW5kIiBzdHJva2U9IiM3ZmJmN2YiIHN0cm9rZS13aWR0aD0iMTAiPjwvbGluZT48%0D%0AdGV4dCBpZD0iU3ZnanNUZXh0MTAxNCIgZm9udC1mYW1pbHk9IlRhaG9tYSIgeD0iMzIiIHk9IjE0%0D%0ANy4xMDE1NjI1IiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmYW1pbHk9IlRh%0D%0AaG9tYSIgc2l6ZT0iMTYiIGFuY2hvcj0ibWlkZGxlIiBzdmdqczpkYXRhPSJ7JnF1b3Q7bGVhZGlu%0D%0AZyZxdW90OzomcXVvdDsxLjVlbSZxdW90O30iPjx0c3BhbiBpZD0iU3ZnanNUc3BhbjEwMTUiIGZp%0D%0AbGw9IiM3ZmJmN2YiPjY8L3RzcGFuPjx0c3BhbiBpZD0iU3ZnanNUc3BhbjEwMTYiIGZpbGw9IiM3%0D%0AZmJmN2YiPiB8PC90c3Bhbj48dHNwYW4gaWQ9IlN2Z2pzVHNwYW4xMDE3IiBmaWxsPSIjZmY2NjY2%0D%0AIj58IDwvdHNwYW4+PHRzcGFuIGlkPSJTdmdqc1RzcGFuMTAxOCIgZmlsbD0iI2ZmNjY2NiI+Mjwv%0D%0AdHNwYW4+PC90ZXh0Pjwvc3ZnPg==">
I was really surprised not finding a convenient test runner/executor in **npm** that can run test scripts in directory/directories recursively from the code. Also it would be nice to log how many tests are failed and passed, log stack traces of failed scripts, and log execution time. Moreover, I wanted to run scripts asynchronously. So, I decided that it's a great opportunity to create a such tool. I've called it **test-executor**, and it's iteresting that this name was available in **npm**. In this article I'll explain how this library works and how to use it.

[This library](https://github.com/Guseyn/node-test-executor) is based on [Async Tree Pattern](/../../pdf/Async_Tree_Pattern.pdf). And that's how you can use it:

```js
const { ExecutedTests } = require('test-executor')

new ExecutedTests(
  './test/test.js', './test/dir1', './test/dir2'
).call()
```
Or, if you want to run everything in **test** directory, you can just type

```js
new ExecutedTests('./test').call()
```
You can specify files or/and directories in arguments. In case of directories, it runs them recursively. The main feature of this library is that it runs tests asynchronously. It forces you to write tests independetly, thereby they are more stable and maintainable.

Here is an example of output (case when one of the tests fail):
![output](https://github.com/Guseyn/node-test-executor/raw/master/screen.png)

<div class="refs">References</div>

P.S. I know that there are test runners like Mocha, Jest, Ava, and so on. But, in my opinion, this library is much more pleasant to use.

* [Test Executor on GitHub](https://github.com/Guseyn/node-test-executor)

[Reddit Comments](https://www.reddit.com/r/node/comments/b2ajit/the_first_test_executor_for_nodejs/) / 
[HN Comments](https://news.ycombinator.com/item?id=19416882)
