Simple Middleware to manage exceptions within express routes in asynchronous.

### Installation:

```
npm install --save @forhot2000/express-async-handler
```
or
```
yarn add @forhot2000/express-async-handler
```

### Usage:

```javascript
import asyncHandler from "@forhot2000/express-async-handler"

express.get('/', asyncHandler(async (req, res, next) => {
    const bar = await foo.findAll();
    res.send(bar)
}))
```

Without express-async-handler

```javascript
express.get('/',(req, res, next) => {
    foo.findAll()
    .then(bar => {
       res.send(bar)
    })
    .catch(next); // error passed on to the error handling route
})
```
