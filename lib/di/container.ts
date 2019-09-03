import { Component } from '../base/component'
import { ConfigureObj } from '../base/configurable'
import { IndexedObjType, InstanceObjType, IndexedFnObjType } from '../base/base-yii'
import { InvalidConfigException } from '../base/exceptions'
import Instance from './instance'

type DefinitionType = null | ((...args: any[]) => void) | string | IndexedObjType

export class Container extends Component {
  private singletons: Map<Function, any> = new Map()

  private definitions: Map<Function, Function> = new Map()

  private params: IndexedObjType = {}

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
  get(className: Function, params: IndexedFnObjType = {}, config: ConfigureObj = {}) {
    if (this.singletons.has(className)) {
      return this.singletons.get(className)
    } else if (!this.definitions.has(className)) {
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
        throw new InvalidConfigException(
          'A class definition requires a "className" member'
        )
      }

      return definition
    }

    throw new InvalidConfigException(
      `Unsupported definition type for ${className}: ${definition}`
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
    className: Function,
    params: IndexedObjType,
    config: ConfigureObj
  ) {
    // reflection
  }

  /**
   * returns the dependencies of the specified class.
   *
   * @param className
   */
  protected getDependcies(className: Function) {
    if (this.reflections.has(className)) {
      return {
        reflection: this.reflections.get(className),
        dependencies: this.dependencies.get(className)
      }
    }

    const dependencies = []
    let reflection: object

    try {
      reflection = Reflect.construct(className, [])
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
  protected resolveDependencies(dependencies: IndexedFnObjType): InstanceObjType {
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
