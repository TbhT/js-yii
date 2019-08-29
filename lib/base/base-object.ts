import { Configurable, ConfigureObj } from './configurable'
import { delegatorForBaseObject } from './delegator'

export class BaseObject implements Configurable {
  [key: string]: any

  public __yiiType = 'BaseObject'

  constructor(config: ConfigureObj = {}) {
    if (Object.keys(config).length > 0) {
      for (const key in config) {
        if (config.hasOwnProperty(key)) {
          this.proxy[key] = config[key]
        }
      }
    }

    this.init()
    return delegatorForBaseObject(this)
  }

  static [Symbol.hasInstance](instance: BaseObject) {
    return instance.__yiiType === 'BaseObject'
  }

  init(): void {}

  canGetProperty(name: string): boolean {
    return !!(
      this[`get${name}`] ||
      (this[name] && typeof this[name] !== 'function')
    )
  }

  canSetProperty(name: string): boolean {
    return !!(
      this[`set${name}`] ||
      (this[name] && typeof this[name] !== 'function')
    )
  }

  hasProperty(name: string): boolean {
    return this.canGetProperty(name) || this.canSetProperty(name)
  }

  hasMethod(name: string): boolean {
    return !!(this[name] && typeof this[name] === 'function')
  }
}
