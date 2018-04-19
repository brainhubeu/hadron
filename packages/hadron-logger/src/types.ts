export interface IHadronLoggerConfig {
  logger: ILoggerConfig[] | ILoggerConfig;
}

export interface ILoggerConfig {
  type: string;
  name: string;
}

export interface ILogger {
  log?: (message: string) => void;
  warn?: (message: string) => void;
  debug?: (message: string) => void;
  error?: (message: string) => void;
}

export type ILoggerFactory = (config: any) => ILogger;
