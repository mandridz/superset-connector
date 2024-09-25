// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

interface ApiError {
  code: number;
  message: string;
}

interface ApiResponse {
  error: ApiError | null;
  data: {
    result: boolean;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();
      message = (responseObj as any).message || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Error logging with request details
    this.logger.error(
      `Status: ${status} Error: ${message} Path: ${request.url} Method: ${
        request.method
      } Body: ${JSON.stringify(request.body)}`,
    );

    // Formation of the response object according to the requirements
    const apiResponse: ApiResponse = {
      error:
        status !== HttpStatus.OK
          ? { code: status, message }
          : { code: 0, message: '' },
      data: {
        result: status === HttpStatus.OK,
      },
    };

    response.status(status).json(apiResponse);
  }
}
