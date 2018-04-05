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

Where: count - amount of virtual users, n - each virtual user will send 20 GET requests.  
Of course to make it work on localhost:8080/\* **_we need to run hadron-demo with sql_**

* Artillery also provides test scripts as in example section. We can run test script with command:

```
    artillery run filename.yml
```

## Output

```
All virtual users finished
Summary report @ 15:10:41(+0200) 2018-04-05
  Scenarios launched:  609
  Scenarios completed: 609
  Requests completed:  1827
  RPS sent: 29.64
  Request latency:
    min: 4.2
    max: 4905.6
    median: 184.7
    p95: 2472.6
    p99: 4358.4
  Scenario counts:
    Inserting, updating, deleting and searching teams: 609 (100%)
  Codes:
    200: 609
    201: 1218
```

Where:

* **_Scenarios launched_** - number of virtual users created
* **_Scenarios completed_** - number of virtual users completed their scenarios
* **_Request completed_** - number of HTTP requests or responses sent
* **_RPS sent_** - average number of requests per second
* **_Request latency_** - are in milliseconds. (a request latency p99 value of 500ms means that 99 out of 100 requests took 500ms or less to complete)
