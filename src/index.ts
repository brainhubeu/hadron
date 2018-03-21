/* tslint:disable */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import { register as expressRegister } from '../packages/hadron-express';
import Container from './containers/container';
import './init';
import { register } from '../packages/hadron-events';
import ICallbackEvent from '../packages/hadron-events/src/ICallbackEvent';

import { register as serializerRegister, schemaProvider, ISerializerConfig } from '../packages/hadron-serialization';

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
        handler: (...params:any[]) => (event: ICallbackEvent) => {
          let original = event.callback;
          console.log('listener1');
          event.callback = () => { 
              return original(...params);
          };
  
      }
    },
  
     { //listener name
      name: 'my-listener-2',
      event: 'createRoutesEvent', // event to listen to
      handler: (...params:any[]) => (event: ICallbackEvent) => {
        console.log('listener2')
        return event.callback;
        }
    },
  
    { 
      name: 'my-listener-3',
      event: 'createRoutesEvent', // event to listen to
      handler: (...params:any[]) => (event: ICallbackEvent) => {
        
        let original = event.callback;
        console.log('listener33');
        event.callback = () => { 
            return "sss";  
        };
    }
  }
]

Container.register('server', expressApp);
register(Container, { events: { listeners }});

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
