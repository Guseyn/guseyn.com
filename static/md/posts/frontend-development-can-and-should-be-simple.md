# EHTML: Front End Development Can and Should Be Simple
<div class="date">19 November 2019</div>

<div class="tags">
  <a class="tag" href="/../tags/ui?v={version}">ui</a>
  <a class="tag" href="/../tags/js?v={version}">js</a>
  <a class="tag" href="/../tags/html?v={version}">html</a>
  <a class="tag" href="/../tags/ehtml?v={version}">ehtml</a>
</div>

<img class="article-logo" style="width: 218px; height: 48px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmNvbS9zdmdqcyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjg0IiBoZWlnaHQ9IjYyIj4KPGRlZnMgaWQ9IlN2Z2pzRGVmczEwMDEiLz4KPHN2ZyBpZD0iU3ZnanNTdmcxMDAyIiB3aWR0aD0iMiIgaGVpZ2h0PSIwIiBzdHlsZT0ib3ZlcmZsb3c6IGhpZGRlbjsgdG9wOiAtMTAwJTsgbGVmdDogLTEwMCU7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgb3BhY2l0eTogMCI+Cjxwb2x5bGluZSBpZD0iU3ZnanNQb2x5bGluZTEwMDMiIHBvaW50cz0iODAsNDYgODAsNTUiLz4KPHBhdGggaWQ9IlN2Z2pzUGF0aDEwMDQiIGQ9Ik0wIDAgIi8+Cjwvc3ZnPgo8cG9seWxpbmUgaWQ9IlN2Z2pzUG9seWxpbmUxMDA2IiBwb2ludHM9IjEsMS41IDQxLDEuNSAxLDEuNSAxLDYxLjUgMSw2MS41IDI4MSw2MS41IDI4MSw2MS41IDI3MSw1MS41IDI3MSw1MS41IDI0MSw1MS41IDI0MSw1MS41IDI0MSwxLjUgMjQxLDEuNSAyMzEsMS41IDIzMSwxLjUgMjMxLDUxLjUgMjI2LDUxLjUgMjIxLDUxLjUgMjIxLDUxLjUgMjIxLDEuNSAyMjEsMS41IDIxMSwxLjUgMjExLDEuNSAxOTEsMjEuNSAxOTEsMjEuNSAxNzEsMS41IDE3MSwxLjUgMTYxLDEuNSAxNjEsMS41IDE2MSw1MS41IDE2MSw1MS41IDE3MSw1MS41IDE3MSw1MS41IDE3MSwxNi41IDE3MSwxNi41IDE5MSwzNi41IDE5MSwzNi41IDIxMSwxNi41IDIxMSwxNi41IDIxMSw1MS41IDE2MSw1MS41IDE0MSw1MS41IDE0MSw1MS41IDEzMSw1MS41IDEzMSw1MS41IDEzMSwxMS41IDEzMSwxMS41IDE1MSwxMS41IDE1MSwxMS41IDE1MSwxLjUgMTUxLDEuNSAxMDEsMS41IDEwMSwxLjUgMTAxLDExLjUgMTAxLDExLjUgMTIxLDExLjUgMTIxLDExLjUgMTIxLDUxLjUgMTIxLDUxLjUgOTEsNTEuNSA5MSw1MS41IDkxLDEuNSA5MSwxLjUgODEsMS41IDgxLDEuNSA4MSwyNi41IDgxLDI2LjUgNjEsMjYuNSA2MSwyNi41IDYxLDUxLjUgNjEsNTEuNSA1MSw1MS41IDUxLDUxLjUgNTEsMS41IDUxLDEuNSA2MSwxLjUgNjEsMS41IDYxLDM2LjUgNjEsMzYuNSA4MSwzNi41IDgxLDM2LjUgODEsNTEuNSAxMSw1MS41IDExLDM2LjUgMTEsMzYuNSA0MSwzNi41IDQxLDM2LjUgNDEsMjYuNSA0MSwyNi41IDExLDI2LjUgMTEsMjYuNSAxMSwxMS41IDExLDExLjUgNDEsMTEuNSA0MSwxMS41IDQxLDEiIGZpbGw9IiNmZmRkNTkiIHN0cm9rZT0iIzQ4NTQ2MCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjxwb2x5bGluZSBpZD0iU3ZnanNQb2x5bGluZTEwMDciIHBvaW50cz0iMTYxLjUsNTAgMTcwLjUsNTAiIGZpbGw9IiNmZmRkNTkiIHN0cm9rZT0iI2ZmZGQ1OSIgc3Ryb2tlLXdpZHRoPSI2Ii8+Cjxwb2x5bGluZSBpZD0iU3ZnanNQb2x5bGluZTEwMDgiIHBvaW50cz0iNTEuNSw1MCA2MC41LDUwIiBmaWxsPSIjZmZkZDU5IiBzdHJva2U9IiNmZmRkNTkiIHN0cm9rZS13aWR0aD0iNiIvPgo8cG9seWxpbmUgaWQ9IlN2Z2pzUG9seWxpbmUxMDA5IiBwb2ludHM9IjYxLDI3IDYxLDM2IiBmaWxsPSIjZmZkZDU5IiBzdHJva2U9IiNmZmRkNTkiIHN0cm9rZS13aWR0aD0iNiIvPgo8L3N2Zz4K">
I am glad to inroduce my new library [EHTML](https://github.com/Guseyn/EHTML) which can help you to reduce complexity in your web applications by throwing away a lot of JavaScript code. Just imagine that you can fetch JSON data and map it to HTML, send and validate forms, make routing and navigations with turbolinks, integrate google sign-in into your app just by using HTML.

**EHTML** is just a set of custom elements that you can put on HTML page for different purposes and use cases. At the moment, it does not have a lot of features as it's just first version. But the idea and philosophy behind this library is very appealing to me because I can build simple things with it so easily that no other library can do.

So, check it out, you might find it very useful and interesting.

<div class="refs">References</div>

* [EHTML](https://github.com/Guseyn/EHTML)

[HN Comments](https://news.ycombinator.com/item?id=21652300)
