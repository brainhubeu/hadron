import { defineSupportCode } from 'cucumber';

defineSupportCode(function({ setWorldConstructor }) {
  const CustomWorld = function() {
    this.result = null;
  };

  setWorldConstructor(CustomWorld);
});
