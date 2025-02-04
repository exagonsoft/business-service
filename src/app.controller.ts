/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  getHealth(): string {
    return "❤️ Business Service Is Healthy ❤️";
  }
}
