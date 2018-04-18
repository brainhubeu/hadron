import logger, { register, registerAdapter } from './src/logger';
import { ILogger, ILoggerConfig, ILoggerFactory } from './src/types';

export default logger;

export { register, ILogger, ILoggerConfig, ILoggerFactory, registerAdapter };
