import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import hadron, { IContainer } from '../packages/hadron-core';
import './init';
import { ICallbackEvent } from '../packages/hadron-events/src/types';
import { schemaProvider, ISerializerConfig } from '../packages/hadron-serialization';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const port = process.env.PORT || 8080;
const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

const listeners = [
  {
    name: 'my-listener-1',
    event: 'createRoutesEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      const original = event.callback;
      console.log('listener1');
      event.callback = () => {
        return original(...params);
      };
    },
  },
  {
    name: 'my-listener-2',
    event: 'createRoutesEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      console.log('listener2')
      return event.callback;
    },
  },
  {
    name: 'my-listener-3',
    event: 'createRoutesEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      const original = event.callback;
      console.log('listener33');
      event.callback = () => {
        return 'sss';
      };
    },
  },
]

const config = { routes: exampleRouting, events: { listeners } };

schemaProvider(['src/example/serialization/*'])
  .then((schemas: any) => {
    const serializerConfig = {
      schemas,
      parsers: {
        currency: (currencyValue: any) => `${currencyValue}$`,
      },
    } as ISerializerConfig;
    (config as any).serializer = serializerConfig;
  })
  .then(() =>
    hadron(expressApp, [
      import('../packages/hadron-events'),  
      import('../packages/hadron-express'),
      import('../packages/hadron-serialization'),
    ], config)
  .then((container: IContainer) => {
    // tslint:disable:no-console
    console.log('We have Container!', container);
    expressApp.listen(port);
  }),
);
