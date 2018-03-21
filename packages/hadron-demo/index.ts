import * as bodyParser from 'body-parser';
import * as express from 'express';
import { register as expressRegister } from '../hadron-express';
import expressConfig from './express';

import hadron, { Container as container } from '../hadron-core';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

container.register('customValue', 'From Brainhub with ❤️');

hadron(expressApp, [
  import('../hadron-express'),
], expressConfig);

expressApp.listen(port);
