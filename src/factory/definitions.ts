import { ContainerInterface } from '../container'
import { NotInstantiableError } from './exceptions'

interface DefinitionInterface {
  resolve(container: ContainerInterface, params: any[]): object
}

interface IndexableObj {
  [key: string]: any
}

interface Constructable {
  new (...params: any[]): any
}

abstract class Definition implements DefinitionInterface {
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
    return Object.assign({}, this.$params)
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
    const dependencies: any[] = this.getDependencies($class)
    const params: any[] = definition.getParams()

    if (params.length > 0) {
      for (const [index, value] of params) {
        dependencies[index] = value
      }
    }

    const resolved = this.resolveDependencies(container, dependencies)
    const obj = new $class(...resolved)
    return this.configure(container, obj, definition.getConfig())
  }

  private getDependencies($class: Function): any[] {
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
