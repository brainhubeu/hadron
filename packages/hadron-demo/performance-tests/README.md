# Performance Tests

## Testing toolkit

Artillery - [Artillery website](https://artillery.io/)

## Basic commmands

* duration: x - phase will last for x seconds
* arrivalRate: x - x new virtual users will arrive every second in phase

## Example

insertUser.yml

```
    config:
  target: 'http://localhost:8080'
  phases:
    - duration: 10
      arrivalRate: 5
  defaults:
scenarios:
  - flow:
    - loop:
        - post:
            url: '/insertUser'
            json:
              userName: 'Test'
              teamId: 1
      count: 3
```

## How to run

* First we need to install Artillery with npm

```
    npm install -g artillery
```

* Now we can do a quick test:

```
    artillery quick --count 10 -n 20 http://localhost:8080/user
```

Where: count - amount of virtual users, n - each virtual user will send 20 GET requests

* Artillery also provides test scripts as in example section. We can run test script with command:

```
    artillery run filename.yml
```

## Output

TODO
