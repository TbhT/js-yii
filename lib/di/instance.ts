import { ServiceLocator } from './service-locator'
import { Container } from './container'
import { isString, isObject } from 'util'

export default class Instance {
  constructor(public id: Function) {}

  /**
   * creates a new Instance object
   * @param id constructor
   */
  public static of(id: Function) {
    return new Instance(id)
  }

  /**
   * resolves the specified reference into the actual object and make sure 
   * it is of the specified type.
   * 
   * The reference may be specified as a string or an Instance object.
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
