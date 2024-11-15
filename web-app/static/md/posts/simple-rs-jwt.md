# Simple JWT Implementation in Node.js: Asymmetric Variation

<div class="date">7 April 2019</div>

[In the previous article](/posts/simple-jwt), I explained how you can implement authorization and authentication via JWT using symmetric algorithms such as **HS256**. Now, I'll try to  explain asymmetric approach (**RS256**). 

You might ask, *why do we need another way of creating JWT*? Well, [this answer](https://stackoverflow.com/questions/39239051/rs256-vs-hs256-whats-the-difference/39239395#39239395) can help you to understand why.

Workflow of using JWT still is the same that we used in the symmetric approach. The only difference is that now we don't use `secret` for creating and validating access token. Instead, we need RSA public/private pair of keys. We use private key only for creating JWT, and public key only for validating it. So, you don't have to keep some secret information for validating tokens. You can generate such pair of keys using following commands:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

So, for generating JWT we do following

```js
const encodedHeaderInBase64 = base64UrlEncodeJSON(header)
const encodedPayloadInBase64 = base64UrlEncodeJSON(payload)
const encodedSignatureInBase64 = generateSignature(`${encodedHeaderInBase64}.${encodedPayloadInBase64}`, privateKey)
const token = `${encodedHeaderInBase64}.${encodedPayloadInBase64}.${encodedSignatureInBase64}`
```

Where `generateSignature` in this case is

```js
const crypto = require('crypto')

function generateSignature (str, privateKey) {
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(str)
  return sign.sign(privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
```

And `base64UrlEncodeJSON` is the same.

```js
function base64UrlEncodeJSON (json) {
  return Buffer.from(
    JSON.stringify(json)
  ).toString('base64')
   .replace(/\+/g, '-')
   .replace(/\//g, '_')
}
```

And for validation we can use following function

```js
// Returns true if token is valid, otherwise returns false
function isValid (token, secret) {
  const parts = token.split('.')
  const header = base64UrlDecodeToJSON(parts[0])
  const payload = base64UrlDecodeToJSON(parts[1])
  if (header.alg !== 'RS256' || header.typ !== 'JWT') {
    return false
  }
  const signature = parts[2]
  const exp = payload.exp
  if (exp) {
    if (exp &lt; new Date().getTime()) {
      return false
    }
  }
  const verify = crypto.createVerify('RSA-SHA256')
  verify.update(unescape(`${parts[0]}.${parts[1]}`))
  return verify.verify(publicKey, signature, 'base64')
}

function base64UrlDecodeToJSON (str) {
  return JSON.parse(
    Buffer.from(
      unescape(str), 'base64'
    ).toString('utf8')
  )
}

function unescape (str) {
  return str.replace(/-/g, '+').replace(/_/g, '/')
}
```

For testing your access token you can also use [this service](https://jwt.io/). Just change `alg` property to `RS256`.

Also, I just released [cutie-jwt](https://github.com/Guseyn/cutie-jwt). So, if you want to use JWT in the declarative style, you should definitely try it.

<br>

[Medium Comments](https://medium.com/@guseynism/simple-jwt-implementation-in-node-js-asymmetric-variation-301f9cb22b20)

<div class="refs">References</div>

* [JWT.io](https://jwt.io/)
* [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
* [RS256 vs HS256: What's the difference?](https://stackoverflow.com/questions/39239051/rs256-vs-hs256-whats-the-difference/39239395#39239395)
* [cutie-jwt](https://github.com/Guseyn/cutie-jwt)
