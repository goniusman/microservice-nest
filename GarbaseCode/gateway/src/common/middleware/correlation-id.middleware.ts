// src/common/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // If the request already has an ID, keep it, otherwise generate a new one
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    
    // Inject into request headers so proxy forwards it to microservices
    req.headers['x-correlation-id'] = correlationId;
    
    // Send it back to the client in the response for debugging
    res.setHeader('x-correlation-id', correlationId);
    
    next();
  }
}