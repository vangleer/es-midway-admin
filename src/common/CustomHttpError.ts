import { MidwayHttpError, HttpStatus } from "@midwayjs/core";

export class CustomHttpError extends MidwayHttpError {
  constructor(message) {
    super(message || '服务器出错啦！！！', HttpStatus.BAD_REQUEST);
  }
}
