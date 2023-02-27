# Simple JWT Implementation in Node.js: Symmetric Variation

<div class="date">6 April 2019</div>

In this article, I'll explain how easily you can implement authorization and authentication via **JWT** using only standard modules in Node.js. So, it might be interesting to you, if you really want to know how it works.

If you don't know what JWT is, you can read [this article](https://en.wikipedia.org/wiki/JSON_Web_Token) first. In few words, JWT is a JSON-based open standard for creating access tokens. Let's say you have a system with some REST API, and you want to securely detect a user who calls methods from this API. JWT is quite simple and effective solution for this problem.

JWT is a string that has following format:

```js
'encodedHeaderInBase64.encodedPayloadInBase64.encodedSignatureInBase64'
```

Let's go through typical workflow of using JWT.

1. User signs in a system with some sensitive data like `password` and simple user data like `email` or `user name`. After successful authentication user gets an access token from server. This token has expiration time, so user cannot use it forever.

2. We save it to local storage, so user can always have it for calling REST API methods.

3. Every time user calls a method from API, we send JWT in headers of request and server verifies that token. If it's valid we are allowed to use API method, otherwise we must sign in the system again to get new access token. It's important to use secure protocols like `https`, because JWT is sensitive data.

4. If a user signs out the system, we delete access token from local storage.

For creating JWT we need two objects: `header` and `payload`.

**Header** is a simple json:

```json
{
 "alg" : "HS256",
 "typ" : "JWT"
}
```

`alg` identifies which algorithm is used to generate the signature, and `type` tell us that we use JSON Web Token. I would recommend you to hardcode this object as a header, if you want to use symmetric algorithms. I don't see any other reason to parametrize this object, so you can avoid a lot of checks on `alg` property and reduce complexity of your code. Or you can use asymmetric algorithms such as **RS256**, and allow your users to identify themselves via their public keys. But in this article we will consider only symmetric approach (**HS256**).

**Payload** is an object that identifies your user, so it has to contain unique data for specific user like `email`. It can also store some other user data, but you definetely shouldn't store there sensitive information like `password`. Also, it's useful to store expiration time of access token there.

```json
{
  "email": "some@email",
  "exp": 1554540588448
}
```

You can use following function to add expiration time to your payload:

```js
function payloadWithExpirationTime (payload, minutesFromNow) {
  let date = new Date()
  date.setMinutes(date.getMinutes() + minutesFromNow)
  payload.exp = date.getTime()
  return payload
} 
```

You might wonder why some property names are just three charatecrs long. I have no idea. I read that's sort of some optimisations, but I don't think that's so important.

So, we have `header` and `payload` as json structures. And we need to convert them in *base64 encoded strings*. For doing this, use following function:

```js
function base64UrlEncodeJSON (json) {
  return Buffer.from(
    JSON.stringify(json)
  ).toString('base64')
   .replace(/\+/g, '-')
   .replace(/\//g, '_')
}
```

Now we have to generate a signature for our token. For doing that, we need a some `secret`. It's a just simple string that only your server knows and it's very important to not compromise it.

Use following function to generate a signature:

```js
const crypto = require('crypto')

function generateSignature (str, secret) {
  return crypto
      .createHmac('sha256', secret)
      .update(str)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
}
```

Function `generateSignature` also encodes string to `base64`.

So, for creating our access token we do something like this:

```js
const encodedHeaderInBase64 = base64UrlEncodeJSON(header)
const encodedPayloadInBase64 = base64UrlEncodeJSON(payload)
const encodedSignatureInBase64 = generateSignature(`${encodedHeaderInBase64}.${encodedPayloadInBase64}`, 'some-secret')
const token = `${encodedHeaderInBase64}.${encodedPayloadInBase64}.${encodedSignatureInBase64}`
```

Now we need to be able to verify our token from 'Authorization' request header: 

```js
// Returns true if token is valid, otherwise returns false
function isValid (token, secret) {
  const parts = token.split('.')
  const header = base64UrlDecodeToJSON(parts[0])
  const payload = base64UrlDecodeToJSON(parts[1])
  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    return false
  }
  const signature = parts[2]
  const exp = payload.exp
  if (exp) {
    if (exp < new Date().getTime()) {
      return false
    }
  }
  return generateSignature(`${parts[0]}.${parts[1]}`, secret) === signature
}

function base64UrlDecodeToJSON (str) {
  return JSON.parse(
    Buffer.from(
      str.replace(/-/g, '+').replace(/_/g, '/'), 'base64'
    ).toString('utf8')
  )
}
```

For testing your access token I would suggest [this service](https://jwt.io/).

So, that's it. You can also check [this sample app](https://github.com/Guseyn/simple-oauth-app) that can show how you can use **JWT** with **Google OAuth** and **GitHub OAuth**. 

[Medium Comments](https://medium.com/@guseynism/simple-jwt-implementation-in-node-js-symmetric-variation-284a02b0bec9)

<div class="refs">References</div>

* [JWT.io](https://jwt.io/)
* [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
* [Sample app using JWT with Google OAuth and GitHub OAuth](https://github.com/Guseyn/simple-oauth-app)
