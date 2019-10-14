import { IndexableObj, Definition } from '../factory/definitions'
import { ServiceProviderInterface, DeferredServiceProvider } from './contracts'
import { isString } from 'util'
import { CircularReferenceError } from '../factory/exceptions'

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
  has(id: string): boolean
}

export class Container implements ContainerInterface {
  private definitions: Map<any, Definition> = new Map()

  // used to collect ids instantiated during build to detect circular references
  private building = new Map()

  // list of providers deferred to register till their service would be requested
  private deferredProviders: Map<any, DeferredServiceProvider> = new Map()

  private instances: Map<any, object> = new Map()

  constructor(
    definitions: IndexableObj = {},
    providers: ServiceProviderInterface[] = []
  ) {
    // todo:
  }

  public getId(id: any): string {
    return isString(id) ? id : id.getId()
  }

  public get(id: string, params: any[] = []): object {
    id = this.getId(id)
    if (this.instances.has(id) === false) {
      this.instances.set(id, this.build(id, params))
    }

    return <object>this.instances.get(id)
  }

  public build(id: string, params: any[] = []): object {
    if (this.building.has(id)) {
      throw new CircularReferenceError(
        `Circular reference to ${id} detected while building: ${this.building}`
      )
    }

    this.building.set(id, 1)
    this.registerProviderIfDeferredFor(id)
  }

  public has(id: string): boolean {
    return this.definitions.has(id)
  }

  private buildInternal(id: string, params: any[] = []) {
    if (this.definitions.has(id) === false) {
      return this.buildPrimitive(id, params)
    }

    return (<Definition>this.definitions.get(id)).resolve(this, params)
  }

  private registerProviderIfDeferredFor(id: string) {
    const providers = this.deferredProviders

    for (const [key, provider] of providers.entries()) {
      if (provider.hasDefinitionFor(id)) {
        provider.register(this)

        // provider should be removed after registration to not be registered again
        providers.delete(key)
      }
    }
  }
}
