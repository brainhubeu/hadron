import bunyan from '../adapters/bunyan';
import { ILogger, ILoggerFactory } from '../types';

const adapters: { [name: string]: ILoggerFactory } = {
  bunyan,
};

export default adapters;
