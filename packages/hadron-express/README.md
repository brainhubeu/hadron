# Hadron express

## Input

### Current

Auto supplied values, supplying based on names match, no order required

Supplying priority:

* under `body`: `req.body` - permanent, no option to get something else, even if `req.body` is empty
* under `req`: `req` - permanent, same as above
* under `res`: `res` - permanent, same as above
* under other keys - with precedence:
  * req.params[name]
  * req.query[name]
  * req.locals[name]
  * container.take(name)

```javascript
const handler = (body, headers);
```
