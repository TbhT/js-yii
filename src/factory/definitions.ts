import { ContainerInterface } from '../di/container'
import { NotInstantiableError, InvalidConfigError } from './exceptions'
import { isFunction, isObject, isArray, isString } from 'util'

interface DefinitionInterface {
  resolve(container: ContainerInterface, params: any[]): object | null
}

export interface IndexableObj {
  [key: string]: any
}

export interface Constructable {
  new (...params: any[]): any
}

export type NormalizeType = Constructable | IndexableObj | Definition | string

export abstract class Definition implements DefinitionInterface {
  abstract resolve(container: ContainerInterface, params: any[]): object
}

/**
 * builds object by array config
 */
export class CtorDefinition extends Definition {
  constructor(
    private $class: Constructable,
    private $params: any[] = [],
    private $config: IndexableObj = {}
  ) {
    super()
  }

  /**
   * getClass
   */
  public getClass(): Constructable {
    return this.$class
  }

  /**
   * getParams
   */
  public getParams(): any[] {
    return this.$params
  }

  /**
   * getConfig
   */
  public getConfig(): IndexableObj {
    return Object.assign({}, this.$config)
  }

  static fromArray(
    className: Constructable,
    params: [] = [],
    config: IndexableObj = {}
  ): CtorDefinition {
    if (!className) {
      throw new NotInstantiableError(`${className} cannot be instanced`)
    }

    return new CtorDefinition(className, params, config)
  }

  /**
   * resolve
   */
  public resolve(container: ContainerInterface, params: any[] = []): object {
    if (Object.keys(params).length > 0) {
      this.$params = [...this.$params, ...params]
    }

    return this.getBuilder().build(container, this)
  }

  private static $builder: CtorBuilder | null = null

  private getBuilder(): CtorBuilder {
    if (CtorDefinition.$builder === null) {
      CtorDefinition.$builder = new CtorBuilder()
    }

    return <CtorBuilder>CtorDefinition.$builder
  }
}

class CtorBuilder {
  private static $dependencies: Map<Function, any[]> = new Map()

  /**
   * build
   */
  public build(container: ContainerInterface, definition: CtorDefinition) {
    const $class = definition.getClass()
    const dependencies: any[] = this.getDependencies(definition)
    const params: any[] = definition.getParams()

    if (params.length > 0) {
      for (const index in params) {
        dependencies[index] = params[index]
      }
    }

    const resolved = this.resolveDependencies(container, dependencies)
    const obj = new $class(...resolved)
    return this.configure(container, obj, definition.getConfig())
  }

  private getDependencies(definition: CtorDefinition): any[] {
    const $class = definition.getClass()
    if (!CtorBuilder.$dependencies.has($class)) {
      CtorBuilder.$dependencies.set($class, definition.getParams())
    }

    return <any[]>CtorBuilder.$dependencies.get($class)
  }

  private resolveDependency(
    container: ContainerInterface,
    dependency: any
  ): any {
    while (dependency instanceof Definition) {
      dependency = dependency.resolve(container, [])
    }

    return dependency
  }

  private resolveDependencies(
    container: ContainerInterface,
    dependencies: any[]
  ): any[] {
    const result: any[] = []

    for (const d of dependencies) {
      const r = this.resolveDependency(container, d)
      result.push(r)
    }

    return result
  }

  private configure(
    container: ContainerInterface,
    obj: IndexableObj,
    config: IndexableObj
  ) {
    for (const action in config) {
      if (obj.hasOwnProperty(action)) {
        let args = config[action]

        if (args instanceof Definition) {
          args = args.resolve(container, [])
        }

        obj[action] = args
      }
    }

    return obj
  }
}

export class ValueDefinition extends Definition {
  constructor(private value: any) {
    super()
  }

  public resolve(container: ContainerInterface, params: any[] = []) {
    return this.value
  }

  /**
   * this is used to detect circle reference.
   * if a concrete reference is guaranteed to never be part of
   * such a circle, null should be returned
   */
  public getId() {
    return null
  }
}

/**
 * class Reference allows us to define a dependency to a service in the
 * container in another service definition. For example:
 *
 * ```javascript
 *
 * {
 *    'classA': classA,
 *    'classB': classB,
 *    'serviceA': {
 *      'className': serviceA,
 *      'args': [
 *        Reference.to('classA')
 *      ]
 *    }
 * }
 *
 * ```
 */
export class Reference implements DefinitionInterface {
  private constructor(private id: string) {}

  public getId(): string {
    return this.id
  }

  public static to(id: string): Reference {
    return new Reference(id)
  }

  public resolve(container: ContainerInterface, params: any[] = []): object {
    return container.get(this.id)
  }
}

/**
 * define may be defined multiple ways:
 * ```javascript
 *
 *
 * ```
 *
 *
 * @param config
 * @param id
 */
export function normalize(
  config: NormalizeType,
  params: any[] = []
): Definition {
  if (config instanceof Definition) {
    return config
  }

  if (isString(config)) {
    // todo: need to be tested
    return Reference.to(config)
  }

  if (isFunction(config)) {
    return new CtorDefinition(<Constructable>config, params)
  }

  if (isObject(config) && isFunction((<IndexableObj>config).className)) {
    const configParams: IndexableObj = Object.assign({}, config)
    const fn: Constructable = (<IndexableObj>config)['className']
    if (fn) {
      delete configParams['className']
    }
    const args: any[] = (<IndexableObj>config)['args']
    
    if (args) {
      delete configParams['args']
    }
    return new CtorDefinition(fn, args, configParams)
  } else if (isObject(config)) {
    return new ValueDefinition(config)
  }

  throw new InvalidConfigError(`Invalid definition: ${config}`)
}
