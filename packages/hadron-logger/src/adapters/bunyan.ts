import * as bunyan from 'bunyan';
import { ILogger } from '../types';

export default (config: any): ILogger => {
  const logger: any = bunyan.createLogger(config);
  return {
    log: (message: string) => {
      logger.info(message);
    },
    debug: (message: string) => {
      logger.debug(message);
    },
    warn: (message: string) => {
      logger.warn(message);
    },
    error: (message: string) => {
      logger.error(message);
    },
  };
};
