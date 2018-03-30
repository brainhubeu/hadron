import { defineSupportCode } from 'cucumber';

/* tslint:disable:only-arrow-functions ter-prefer-arrow-callback  */

defineSupportCode(function({ Given, When, Then }) {
  Given('brainhub is the best', function(callback) {
    callback();
  });

  When('add {string} to {string}', function(number1, number2) {
    this.result = parseInt(number1, 10) + parseInt(number2, 10);
  });

  Then('the result is {string}', function(result) {
    if (this.result !== parseInt(result, 10)) {
      throw new Error(
        `Expected result to be equal ${result} but it is ${this.result}`,
      );
    }
  });

  Then('the result is null', function() {
    if (this.result !== null) {
      throw new Error(`Expected result to be null but it is ${this.result}`);
    }
  });
});
