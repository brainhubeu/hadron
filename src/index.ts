import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import hadron, { IContainer } from '../packages/hadron-core';
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

const config = { routes: exampleRouting };

hadron(expressApp, [
  import('../packages/hadron-express'),
], config)
  .then((container: IContainer) => {
    // tslint:disable:no-console
    console.log('We have Container!', container);
  });

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
