import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const elapsedTime = Date.now() - startTime;
      const { method, originalUrl } = req;
      const statusCode = res.statusCode;

      this.logger.log(`${method} ${originalUrl} ${statusCode} ${elapsedTime} ms`);
    });

    next();
  }
}