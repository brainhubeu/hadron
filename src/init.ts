import * as dotenv from "dotenv";

import Container from './containers/container';
import { EventEmitter } from 'events';
import { Lifetime } from "containers/lifetime";
dotenv.config(); // we need this before anything that may need envs

// default container items
Container.register("emitter", EventEmitter, Lifetime.Singletone);
