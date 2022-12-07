import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  toString<T = any>(obj: T): string {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      this.logger.error(e);
      return '';
    }
  }

  parse<T = any>(str: string, defaultReturn?: T): T {
    try {
      return JSON.parse(str);
    } catch (e) {
      this.logger.error(e);
      return (defaultReturn || {}) as T;
    }
  }
}
