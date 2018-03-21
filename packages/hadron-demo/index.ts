import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import expressConfig from './express';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

hadron(expressApp, [
  import('../hadron-express'),
], expressConfig)
  .then((container: IContainer) => {
    container.register('customValue', 'From Brainhub with ❤️');
  });

expressApp.listen(port);
