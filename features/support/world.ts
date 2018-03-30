import { defineSupportCode } from 'cucumber';

/* tslint:disable:only-arrow-functions ter-prefer-arrow-callback */

defineSupportCode(function({ setWorldConstructor }) {
  const customWorld = function() {
    this.result = null;
  };

  setWorldConstructor(customWorld);
});
