import * as bunyan from 'bunyan';
import LoggerNameIsRequiredError from './errors/LoggerNameIsRequiredError';

const register = (container: any, config: any) => {
  let { logger: loggers } = config;

  loggers = loggers instanceof Array ? loggers : [loggers];

  loggers.forEach((logger: any) => {
    if (!logger.name) {
      throw new LoggerNameIsRequiredError();
    }

    const log = bunyan.createLogger(logger);

    container.register(logger.name, log);
  });
};

export default register;
export { register };
