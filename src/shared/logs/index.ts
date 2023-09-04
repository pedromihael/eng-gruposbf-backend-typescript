import { createLogger, transports, format } from "winston";
import path from 'path';

const defaultConfig = {
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
};

export const consoleLogger = createLogger({
  ...defaultConfig,
  transports: [
    new transports.Console(),
  ],
});

export const fileLogger = createLogger({
  ...defaultConfig,
  transports: [
    new transports.File({
      dirname: path.join(__dirname, "./out"),
      filename: "api-logs.log",
    }),
  ],
});