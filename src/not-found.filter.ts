import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).send(`
      <html>
        <head><title>404 - Topilmadi</title></head>
        <body style="text-align:center; font-family:sans-serif;">
          <h1>404</h1>
          <p>Sahifa topilmadi</p>
          <a href="/">Bosh sahifaga qaytish</a>
        </body>
      </html>
    `);
  }
}
