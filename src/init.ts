import { Lifetime } from 'containers/lifetime';
import * as dotenv from 'dotenv';
import { EventEmitter } from 'events';
import Container from './containers/container';

dotenv.config(); // we need this before anything that may need envs
