import { ServiceLocator } from './service-locator'
import { Container } from './container'
import { isString, isObject } from 'util'

export default class Instance {
  protected constructor(public id: string) {}

  /**
   *
   */
  public static of(id: string) {
    return new Instance(id)
  }

  /**
   * resolves the specified reference into the actual object and
   */
  public static ensure(
    reference: string | object,
    type: string | null = null,
    container: ServiceLocator | Container | null = null
  ) {
    if (isObject(reference)) {
      const cls = !!reference ? reference.class : type
      if (!(container instanceof Container)) {

      }
    }
  }
}
