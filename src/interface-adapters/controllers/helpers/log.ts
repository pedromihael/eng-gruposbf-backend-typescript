import { Request } from 'express';
import { consoleLogger, fileLogger } from '../../../shared/logs/index';

export const log = (req: Request, method: string, route: string) => {
  const ipAddress = req.socket.remoteAddress;
  const logMessage = `${method} ${route} - IP ${ipAddress}`;

  consoleLogger.info(logMessage);
  
  if (req.body) {
    fileLogger.info(`${logMessage} - BODY ${JSON.stringify(req.body)}`)
  } else {
    fileLogger.info(logMessage)
  }
}