import { saveModule, saveClassMetadata, Scope, ScopeEnum, RouterOption, Controller } from '@midwayjs/core'

// 提供一个唯一 key
export const MODEL_KEY = 'decorator:es-controller'
export declare type ApiTypes = 'add' | 'delete' | 'update' | 'page' | 'info' | 'list'
export interface CurdOption {
  prefix?: string;
  api: ApiTypes[];
  insertParam?: Function;
  before?: Function;
  infoIgnoreProperty?: string[];
  entity?: any; // entity | service二选一
  service?: any; // entity | service二选一
}

export function ESController(curdOption?: CurdOption | string, routerOptions?: RouterOption): ClassDecorator {
  return (target) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(MODEL_KEY, target)
    // 处理options
    curdOption = curdOption || ''
    const options = typeof curdOption === 'string' ? { prefix: curdOption } : curdOption

    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(
      MODEL_KEY,
      {
        options
      },
      target
    )

    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Request)(target)
    if (!curdOption) {
      Controller()(target)
    } else {
      Controller(options.prefix, routerOptions)(target)
    }
  }
}
