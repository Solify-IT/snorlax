interface LogEntry {
  level: string;
  message: string;
  [optionName: string]: any;
}

export interface ILogger {
  log: LogMethod;

  // for cli and npm levels
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  help: LeveledLogMethod;
  data: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
  prompt: LeveledLogMethod;
  http: LeveledLogMethod;
  verbose: LeveledLogMethod;
  input: LeveledLogMethod;
  silly: LeveledLogMethod;

  // for syslog levels only
  emerg: LeveledLogMethod;
  alert: LeveledLogMethod;
  crit: LeveledLogMethod;
  warning: LeveledLogMethod;
  notice: LeveledLogMethod;
}

type LogCallback = (error?: any, level?: string, message?: string, meta?: any) => void;

interface LogMethod {
  (level: string, message: string, callback: LogCallback): ILogger;
  (level: string, message: string, meta: any, callback: LogCallback): ILogger;
  (level: string, message: string, ...meta: any[]): ILogger;
  (entry: LogEntry): ILogger;
  (level: string, message: any): ILogger;
}

interface LeveledLogMethod {
  (message: string, callback: LogCallback): ILogger;
  (message: string, meta: any, callback: LogCallback): ILogger;
  (message: string, ...meta: any[]): ILogger;
  (message: any): ILogger;
  (infoObject: object): ILogger;
}
