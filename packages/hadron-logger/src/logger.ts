import * as bunyan from 'bunyan';
import { toCamelCase } from '../../hadron-utils/';

const register = (container: any, config: any) => {
  let { logger: loggers } = config;

  loggers = loggers instanceof Array ? loggers : [loggers];

  loggers.forEach((logger: any) => {
    const log = bunyan.createLogger(logger);

    /* tslint:disable-next-line:strict-boolean-expressions */
    let itemName = logger.name || '';
    if (!itemName.match(/(.*)logger$/gi)) itemName += ' logger';
    itemName = toCamelCase(itemName);
    container.register(itemName, log);
  });
};

export default register;
export { register };
