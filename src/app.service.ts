import { Injectable } from '@nestjs/common';
import { AppErrors } from './exceptionfilter/errors/errors';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
