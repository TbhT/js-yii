import { BaseObject } from './base-object'
import { InvalidCallException, UnknownPropertyException } from './exceptions'

const handler = {
  get(obj: BaseObject, name: string): any {
    const getter = `get${name}`

    if (typeof obj[getter] === 'function') {
      return obj[getter]()
    } else if (obj[`set${name}`]) {
      const errorMessage = `Getting write-only property: ${
        obj.constructor.name
      } Object's property ${name}`

      throw new InvalidCallException(errorMessage)
    } else if (obj[name]) {
      return obj[name]
    }

    const errorMessage = `Getting unknown property: ${
      obj.constructor.name
    } Object's property ${name}`

    throw new UnknownPropertyException(errorMessage)
  },
  set(obj: BaseObject, name: string, value: any): boolean {
    const setter = `set${name}`

    if (typeof obj[setter] === 'function') {
      obj[setter](value)
      return true
    } else if (obj[`get${name}`]) {
      const errorMessage = `Getting read-only property: ${
        obj.constructor.name
      } Object's property ${name}`

      throw new InvalidCallException(errorMessage)
    } else if (obj[name]) {
      obj[name] = value
      return true
    } else {
      const errorMessage = `Setting unknown property: ${
        obj.constructor.name
      } Object's property ${name}`

      throw new UnknownPropertyException(errorMessage)
    }
  }
}

export function delegateProperties(target: BaseObject) {
  return new Proxy(target, handler)
}
