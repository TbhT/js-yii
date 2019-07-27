import { Configurable, ConfigureObj } from './configurable'

export abstract class BaseObject implements Configurable {
  [key: string]: any

  constructor(config: ConfigureObj = {}) {
    if (Object.keys(config).length > 0) {
      for (const key in config) {
        if (config.hasOwnProperty(key)) {
          this.proxy[key] = config[key]
        }
      }
    }

    this.init()
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
