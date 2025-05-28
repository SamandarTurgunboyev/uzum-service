import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // http://localhost:3000/ ga kirganda avtomatik Swagger UI ga redirect
  @Get()
  getRedirect(@Res() res: Response) {
    return res.redirect('/api');
  }
}
