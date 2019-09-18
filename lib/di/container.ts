import { Component } from '../base/component'
import { ConfigureObj } from '../base/configurable'
import {
  IndexedObjType,
  InstanceObjType,
  IndexedFnObjType
} from '../base/base-yii'
import { InvalidConfigException } from '../base/exceptions'
import Instance from './instance'

type DefinitionType =
  | null
  | ((...args: any[]) => void)
  | string
  | IndexedObjType

export class Container extends Component {
  private singletons: Map<Function | string, any> = new Map()

  private definitions: Map<Function | string, Function> = new Map()

  private params: Map<Function | string, IndexedObjType> = new Map()

  private dependencies: IndexedObjType = {}

  private reflections: Map<Function, any> = new Map()

  /**
   * return an instance of the requested class
   *
   * You may provide constructor parameters (`params`) and configuration (`config`)
   * that will be used during creation of the instance
   *
   * if the class implements [[Configurable]], the `config` will be passed as the last
   * parameter to class constructor; Otherwise, the configuration will be applied *after*
   * the object is instantiated.
   *
   * @param className the class name or an alias name that was previously registered via
   * [[set()]] or [[setSingleton()]]
   * @param params a list of constructor parameter values.
   * @param config a list of key-val pairs the will be used to initialize the object properties
   */
  get(
    className: Function | string,
    params: IndexedObjType = {},
    config: ConfigureObj = {}
  ) {
    if (this.singletons.has(className)) {
      return this.singletons.get(className)
    } else if (!this.definitions.has(className)) {
      return this.build(className, params, config)
    }

    const definition = this.definitions.get(className)
  }

  /**
   * Register a class definition with this container
   *
   * For example:
   * // register a class name as is. This is can be skiped
   * container.set(Connection)
   *
   * // register an alias name. You can use $container->get('foo')
   * // to create an instance of Connection
   * container.set('foo', {
   *  className: Connection
   * })
   *
   * // register a class with configuration. The configuration
   * // will be applied when the class is instantiated by get()
   * container.set(Connection, {
   *  'host': '127.0.0.1',
   *  'port': 3306,
   *  'username': 'root',
   *  'password': '',
   *  'charset': 'utf-8'
   * })
   *
   * If a class definition with the same name already exists, it will be overwritten with the new one.
   * You may use [[has()]] to check if a class definition already exists.
   *
   * @param className
   * @param params
   */
  set(className: string | Function, params: IndexedObjType = {}) {
    const definition = this.normalizeDefinition(className, params)

    this.definitions.set(className, definition.className)
    this.params.set(className, params)
    this.singletons.delete(className)
    return this
  }

  protected normalizeDefinition(
    className: string | Function,
    params: IndexedObjType
  ) {
    if (!params) {
      return { className }
    } else if (typeof className === 'string') {
      return { className: params['className'] }
    } else if (typeof className === 'function') {
      return { className }
    }

    throw new InvalidConfigException(
      `Unsupported definition type for ${className}: ${params}`
    )
  }

  /**
   * creates an instance of the specified class.
   * This method will resolve dependencies of the specified class, instantiate them
   * and inject them into the new instance of the specified class
   * @param className
   * @param params
   * @param config
   */
  protected build(
    className: Function  | string,
    params: IndexedObjType,
    config: ConfigureObj
  ) {
    
  }

  /**
   * returns the dependencies of the specified class.
   *
   * @param className
   */
  protected getDependencies(className: Function): object | null {
    if (this.reflections.has(className)) {
      return this.dependencies.get(className)
    }

    const dependencies = []

    try {
    } catch (error) {
      throw new InvalidConfigException(
        `Failed to instantiate component or class "${className.name}". ${error}`
      )
    }
  }

  /**
   * resolves dependencies by replacing them with the actual object instances
   *
   * @param dependencies
   */
  protected resolveDependencies(
    dependencies: IndexedFnObjType
  ): InstanceObjType {
    const dp: InstanceObjType = {}

    Object.keys(dependencies).map(className => {
      const dependency = dependencies[className]
      if (dependency instanceof Instance && dependency.id) {
        dp[className] = this.get(dependency.id)
      }
    })

    return dp
  }
}
