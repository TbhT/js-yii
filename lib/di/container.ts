import { Component } from '../base/component'
import { ConfigureObj } from '../base/configurable'
import { IndexedObj } from '../base/base-yii'
import { InvalidConfigException } from '../base/exceptions';

type DefinitionType = null | ((...args: any[]) => void) | string | IndexedObj

export class Container extends Component {
  private singletons: IndexedObj = {}

  private definitions: IndexedObj = {}

  private params: IndexedObj = {}

  private dependencies: IndexedObj = {}

  get(className: string, params: IndexedObj = [], config: ConfigureObj = {}) {
    if (this.singletons[className]) {
      return this.singletons[className]
    } else if (!this.definitions[className]) {
      return this.build(className, params, config)
    }

    const definition = this.definitions[className]
  }

  set(className: string, definition = {}, params = []) {
    // this.definitions[className] =
  }

  protected normalizeDefinition(
    className: string,
    definition: DefinitionType = null
  ) {
    if (!definition) {
      return { className }
    } else if (typeof definition === 'string') {
      return { className: definition }
    } else if (typeof definition === 'function') {
      return definition
    } else if (typeof definition === 'object') {
      if (!definition['className']) {
        throw new InvalidConfigException('A class definition requires a "className" member')
      }

      return definition
    }

    throw new InvalidConfigException(`Unsupported definition type for ${className}: ${definition}`)
  }

  protected build(className: string, params: IndexedObj, config: ConfigureObj) {
    
  }
}
