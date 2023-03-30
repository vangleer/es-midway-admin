import { App, Configuration, ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as orm from '@midwayjs/typeorm';
import * as egg from '@midwayjs/web';
import { ExceptionFilter } from './filters/exception';

@Configuration({
  imports: [egg, orm],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {
    this.app.useFilter(ExceptionFilter)
  }
}
