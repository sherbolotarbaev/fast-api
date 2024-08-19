import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  main(@Res() response: FastifyReply) {
    return response.status(200).send({
      message: 'Hey there 👋',
    });
  }
}
