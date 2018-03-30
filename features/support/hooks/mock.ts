import { defineSupportCode } from 'cucumber';
import * as superagent from 'superagent';
import Client from '../scripts/Client';

defineSupportCode(({ Before }) => {
  Before(function(scenarioResult) {
    this.client = new Client(superagent);
    this.client.setHost('http://localhost:8080');
  });
});
