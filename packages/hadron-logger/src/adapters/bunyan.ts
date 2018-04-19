import * as bunyan from 'bunyan';
import { ILogger, ILoggerConfig } from '../types';

export default (config: ILoggerConfig): ILogger => {
  const logger: bunyan = bunyan.createLogger(config);
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
