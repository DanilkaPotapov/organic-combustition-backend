import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class EmptyHttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(EmptyHttpErrorFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    if (status === 500) this.logger.error(exception);
    response.status(status).send();
  }
}
