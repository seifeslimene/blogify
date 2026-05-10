import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { errorLogger } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Request routing
    const url = request.originalUrl;
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = exception.message.message || exception.message; // error message
    const errorResponse = {
      statusCode: status,
      msg,
      success: false,
      data: null,
    };

    // Set the returned status code, request headers, and send error information
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
    errorLogger.error(url, errorResponse);
  }
}
