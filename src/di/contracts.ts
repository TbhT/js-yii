import { Container } from './container'
import { IndexableObj } from '../factory/definitions'

/**
 * represents a component responsible for class registration in the Container.
 *
 * ```javascript
 *
 * class CarProvider implements ServiceProviderInterface {
 *   protected container
 *
 *   constructor(container) {
 *     this.container = container
 *   }
 *
 *   public register() {
 *     this.registerDependencies()
 *     this.registerService()
 *   }
 *
 *   protected registerDependencies() {
 *     const container = this.container
 *     container.set(Engine.name, Engine)
 *     container.set(Wheel.name, {
 *        className: Wheel,
 *        color: 'red'
 *     })
 *   }
 *
 *   protected registerService() {
 *     this.container.set(Car.name, {
 *        className: Car,
 *        color: 'red'
 *     })
 *   }
 *
 * }
 *
 * ```
 */
export interface ServiceProviderInterface {
  register(container: Container): void
}

export abstract class ServiceProvider implements ServiceProviderInterface {
  abstract register(container: Container): void
}

interface DeferredServiceProviderInterface extends ServiceProviderInterface {
  hasDefinitionFor(id: string): boolean
}

/**
 * Base class for service providers that should be deferred to register till services are
 * actually required.
 *
 * Complex services with heavy dependencies might create redundant load during bootstrapping
 * of an application so to reduce actions performed during the container bootstrap you can
 *
 * Deferred providers can be added to the Container like basic providers but won't register
 * any definitions to the container till one of the classes listed in `provides` method would
 * be requested from container. Example:
 *
 * ```javascript
 *
 * class CarProvider extends DeferredServiceProvider {
 *    public provides() {
 *      return {
 *        car: Car,
 *        carFactory: CarFactory
 *      }
 *    }
 *
 *    public register() {
 *      const container = this.container
 *      container.set('car', Car)
 *      container.set('carFactory', CarFactory)
 *      container.set('engine', EngineMarkOne)
 *    }
 * }
 *
 * ```
 */
export abstract class DeferredServiceProvider
  implements DeferredServiceProviderInterface {
  public abstract register(container: Container): void

  public abstract provides(): IndexableObj

  public hasDefinitionFor(id: string): boolean {
    return id in this.provides()
  }
}
