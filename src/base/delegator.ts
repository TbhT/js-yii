import { BaseObject } from './base-object'
import { InvalidCallException, UnknownPropertyException } from './exceptions'
import { Component } from './component'
import { Proxy } from './advance-type'

const baseObjectHandler = {
  setPrototypeOf() {
    return false
  },

  getPrototypeOf() {
    return BaseObject.prototype
  },

  get(obj: BaseObject, name: string): any {
    const getter = `get${name}`

    if (typeof obj[getter] === 'function') {
      return obj[getter]()
    } else if (obj[`set${name}`]) {
      const errorMessage = `Getting write-only property: ${
        obj.constructor.name
      }'s property ${name}`

      throw new InvalidCallException(errorMessage)
    } else if (obj[name]) {
      return obj[name]
    }

    const errorMessage = `Getting unknown property: ${
      obj.constructor.name
    }'s property ${name}`

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
      }'s property ${name}`

      throw new InvalidCallException(errorMessage)
    } else if (obj[name]) {
      obj[name] = value
      return true
    } else {
      const errorMessage = `Setting unknown property: ${
        obj.constructor.name
      }'s property ${name}`

      throw new UnknownPropertyException(errorMessage)
    }
  }
}

export function ProxyBaseObject(target: BaseObject) {
  return new Proxy(target, baseObjectHandler)
}

const componentHandler = {
  setPrototypeOf() {
    return false
  },

  getPrototypeOf() {
    return Component.prototype
  },

  get(obj: Component, name: string): any {
    const getter = `get${name}`

    if (typeof obj[getter] === 'function') {
      return obj[getter]()
    }

    obj.ensureBehaviors()

    const behaviors = obj.getBehaviors()

    for (const behavior in behaviors) {
      if (
        behaviors.hasOwnProperty(behavior) &&
        behaviors[behavior] &&
        behaviors[behavior].canGetProperty(name)
      ) {
        return behaviors[behavior][name]
      }
    }

    if (obj[name]) {
      return obj[name]
    }

    const setter = `set${name}`
    if (obj[setter]) {
      const errorMessage = `Getting write-only property: ${
        obj.constructor.name
      }'s property ${name}`

      throw new InvalidCallException(errorMessage)
    }

    const errorMessage = `Setting unknown property: ${
      obj.constructor.name
    }'s property ${name}`

    throw new UnknownPropertyException(errorMessage)
  },

  set(obj: Component, name: string, value: any) {
    const setter = `set${name}`

    if (typeof obj[setter] === 'function') {
      obj[setter](value)
      return true
    } else if (name.substr(0, 3) === 'on ') {
      obj.on(name.substr(3), value)
      return true
    } else if (name.substr(0, 3) === 'as ') {
      obj.attachBehavior(name, value)
      return true
    }

    obj.ensureBehaviors()
    const behaviors = obj.getBehaviors()

    const flag = Object.keys(behaviors).some(behaviorName => {
      if (behaviors[behaviorName].canSetProperty(name)) {
        behaviors[behaviorName] = value
        return true
      }

      return false
    })

    if (flag) {
      return true
    }

    if (obj[`get${name}`]) {
      throw new InvalidCallException(
        `Setting read-only property: ${
          this.constructor.name
        }'s property ${name}`
      )
    }

    throw new UnknownPropertyException(
      `Setting unknown property: ${obj.constructor.name}'s property ${name}`
    )
  }
}

export function ProxyComponent(target: Component) {
  return new Proxy(target, componentHandler)
}
