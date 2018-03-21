<<<<<<< HEAD
import { Lifetime } from 'containers/lifetime';
import * as dotenv from 'dotenv';
import { EventEmitter } from 'events';
import Container from './containers/container';

dotenv.config(); // we need this before anything that may need envs
// default container items
Container.register('emitter', EventEmitter, Lifetime.Singletone);
=======
import * as dotenv from "dotenv";

import Container from './containers/container';
import { EventEmitter } from 'events';
import { Lifetime } from "containers/lifetime";
dotenv.config(); // we need this before anything that may need envs

// default container items
Container.register("emitter", EventEmitter, Lifetime.Singletone);
>>>>>>> adff7b61c7d7629835fd97e030d4c7608b480fe4
