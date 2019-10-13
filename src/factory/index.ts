import { ContainerInterface } from '../container'
import {
  IndexableObj,
  Constructable,
  Definition,
  normalize,
  CtorDefinition,
  NormalizeType
} from './definitions'
import { isFunction } from 'util'

/**
 * Factory allows for creation of object using runtime parameters.
 * A factory will use container to get dependencies, but will fall
 * back to manual instantiation.
 *
 *
 */
interface FactoryInterface extends ContainerInterface {
  /**
   * create
   */
  create(config: IndexableObj): object
  create(className: Constructable, params: any[]): object
}

export class Factory implements FactoryInterface {
  public container: ContainerInterface | null
  private definitions: Map<string, Definition>

  constructor(container: ContainerInterface, definitions: IndexableObj = {}) {
    this.container = container || null
    this.definitions = new Map()
    this.setMultiple(definitions)
  }

  create(config: NormalizeType, params: any[] = []): object {
    return normalize(config, params).resolve(this, params)
  }

  get(id: any, params: any[] = []): object {
    return this.getDefinition(id).resolve(this, params)
  }

  set(id: string, definition: NormalizeType) {
    const df = normalize(definition)
    this.definitions.set(id, df)
  }

  setMultiple(definitions: IndexableObj) {
    Object.keys(definitions).map(key => {
      this.set(key, definitions[key])
    })
  }

  has(id: string): boolean {
    return this.definitions.has(id)
  }

  getDefinition(id: any): Definition {
    if (this.has(id)) {
      return <Definition>this.definitions.get(id)
    }

    if (isFunction(id)) {
      return new CtorDefinition(id)
    }

    return normalize(<IndexableObj>id)
  }
}
