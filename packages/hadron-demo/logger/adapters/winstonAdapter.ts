import * as winston from 'winston';
import { ILogger } from '@brainhubeu/hadron-logger';

export default (config: any): ILogger => {
  winston.loggers.add(config.name, config);
  const logger = winston.loggers.get(config.name);

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
