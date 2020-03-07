import {
  IndexableObj,
  Definition,
  Constructable,
  NormalizeType,
  normalize,
  CtorDefinition
} from '../factory/definitions'
import {
  ServiceProviderInterface,
  DeferredServiceProvider,
  ServiceProvider
} from './contracts'
import { isString } from 'util'
import {
  CircularReferenceError,
  InvalidConfigError
} from '../factory/exceptions'

/**
 * base interface representing a generic Error in a container
 */
export interface ContainerErrorInterface {}

/**
 * no entry was found in the container
 */
export interface NotFoundErrorInterface extends ContainerErrorInterface {}

export interface ContainerInterface {
  /**
   * finds an entry of the container by its identifier and return it
   *
   * @param id identifier of the entry to look for
   * @throws NotFoundErrorInterface
   * @throws ContainerErrorInterface
   */
  get(id: string): object

  /**
   * return true if the container can return an entry for the given identifier
   * return false otherwise
   *
   * @param {string} id identifier
   * @returns {boolean}
   */
  has(id: NormalizeType): boolean
}

export class Container implements ContainerInterface {
  private definitions: Map<any, Definition> = new Map()

  // used to collect ids instantiated during build to detect circular references
  private building = new Map()

  // list of providers deferred to register till their service would be requested
  private deferredProviders: DeferredServiceProvider[] = []

  private instances: Map<any, object | null> = new Map()

  constructor(
    definitions: IndexableObj = {},
    providers: ServiceProviderInterface[] = []
  ) {
    this.setMultiple(definitions)

    for (const provider of providers) {
      this.addProvider(provider)
    }
  }

  public getId(id: any): string {
    return id
  }

  public get(id: NormalizeType, params: any[] = []): object {
    id = this.getId(id)
    if (this.instances.has(id) === false) {
      this.instances.set(id, this.build(id, params))
    }

    return <object>this.instances.get(id)
  }

  protected build(id: NormalizeType, params: any[] = []): object {
    if (this.building.has(id)) {
      throw new CircularReferenceError(
        `Circular reference to ${id} detected while building Container#building`
      )
    }

    this.building.set(id, 1)
    this.registerProviderIfDeferredFor(id)
    const obj = this.buildInternal(id, params)
    this.building.delete(id)

    return obj
  }

  public addProvider(providerDefinition: NormalizeType) {
    const provider = this.buildProvider(providerDefinition)

    if (provider instanceof DeferredServiceProvider) {
      this.deferredProviders.push(provider)
    } else {
      provider.register(this)
    }
  }

  private buildProvider(
    providerDefinition: NormalizeType
  ): ServiceProviderInterface {
    const provider = normalize(providerDefinition).resolve(this, [])
    if (!(provider instanceof ServiceProvider)) {
      throw new InvalidConfigError(
        `Service provider should be an instance of ${provider}`
      )
    }

    return provider
  }

  public set(id: NormalizeType, $definition: NormalizeType) {
    if (this.instances.has(id)) {
      this.instances.delete(id)
    }

    const def = normalize($definition)
    this.definitions.set(id, def)
  }

  public setMultiple(definitions: IndexableObj) {
    Object.keys(definitions).map(key => {
      this.set(key, <NormalizeType>definitions[key])
    })
  }

  public has(id: NormalizeType): boolean {
    return this.definitions.has(id)
  }

  public hasInstance(id: NormalizeType): boolean {
    return this.instances.has(this.getId(id))
  }

  public getInstances() {
    const result = []
    for (const iterator of this.instances.values()) {
      result.push(iterator)
    }
    return result
  }

  private buildInternal(id: NormalizeType, params: any[] = []): object {
    if (this.definitions.has(id) === false) {
      return this.buildPrimitive(id, params)
    }

    return (<Definition>this.definitions.get(id)).resolve(this, params)
  }

  private buildPrimitive(id: NormalizeType, params: any[] = []): object {
    return normalize(id).resolve(this, params)
  }

  private registerProviderIfDeferredFor(id: NormalizeType) {
    const providers = this.deferredProviders.slice()

    for (let index = 0; index < providers.length; index++) {
      const provider = providers[index]
      if (provider.hasDefinitionFor(id)) {
        provider.register(this)

        // provider should be removed after registration to not be registered again
        this.deferredProviders.splice(index, 1)
      }
    }
  }
}
