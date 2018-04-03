import * as bunyan from 'bunyan';
import { toCamelCase } from '../../hadron-utils/';

const register = (container: any, config: any) => {
  let { logger: loggers } = config;

  loggers = loggers instanceof Array ? loggers : [loggers];

  loggers.forEach((logger: any) => {
    if (!logger.name) return;
    const log = bunyan.createLogger(logger);

    let { name } = logger;
    if (!name.match(/(.*)logger$/gi)) name += ' logger';
    name = toCamelCase(name);
    container.register(name, log);
  });
};

export default register;
export { register };
