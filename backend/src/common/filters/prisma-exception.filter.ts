import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception && exception.code && typeof exception.code === 'string' && exception.code.startsWith('P')) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Database operation error';

      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = `Unique constraint violation on field: ${JSON.stringify(exception.meta?.target || 'unique field')}`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Requested database record not found';
      }

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: exception.code,
        error: message,
      });
    }

    // Fallback if not Prisma error
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message || 'Internal Server Error',
    });
  }
}
