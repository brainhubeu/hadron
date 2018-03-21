import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import { register as expressRegister } from '../packages/hadron-express';
import Container from './containers/container';
import './init';
import { register as serializerRegister, schemaProvider, ISerializerConfig } from '../packages/hadron-serialization';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const port = process.env.PORT || 8080;
const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

Container.register('server', expressApp);

schemaProvider(['src/example/serialization/*'])
  .then(schemas => {
    const serializerConfig = {
      schemas,
      parsers: {
        currency: (currencyValue: any) => `${currencyValue}$`,
      },
    } as ISerializerConfig;
    serializerRegister(Container, { serializer: serializerConfig });
  });

expressRegister(Container, { routes: exampleRouting });

expressApp.listen(port);
