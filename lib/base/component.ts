import { BaseObject } from './base-object'
import { EventEmitter } from 'events'
import { Behavior } from './behavior'

interface BehaviorObj {
  [key: string]: Behavior
}

export class Component extends BaseObject {

  private behaviors: BehaviorObj = {}

  private e: EventEmitter

  public __yiiType = 'Component'

  constructor() {
    super()
    this.e = new EventEmitter()
  }

  static [Symbol.hasInstance](instance: Component) {
    return instance.__yiiType === 'Component'
  }

  static behaviors(): BehaviorObj {
    return {}
  }

  on(event: string | symbol, listener: (...arg: any[]) => void): void {
    this.ensureBehaviors()

    this.e.on(event, listener)
  }

  off(event: string | symbol, listener: (...arg: any[]) => void | null): void {
    this.ensureBehaviors()

    this.e.off(event, listener)
  }

  emit(event: string | symbol, ...args: any[]): void {
    this.ensureBehaviors()

    this.e.emit(event, args)
  }

  getBehavior(name: string): Behavior {
    this.ensureBehaviors()

    return this.behaviors[name] || null
  }

  getBehaviors() {
    return this.behaviors
  }

  ensureBehaviors() {
    if (Object.keys(this.behaviors).length > 0) {
      const behaviors = Component.behaviors()
      Object.keys(behaviors).map(name => {
        this.attachBehaviorInternal(name, behaviors[name])
      })
    }
  }

  attachBehavior(name: string, behavior: Behavior): Behavior {
    this.ensureBehaviors()

    return this.attachBehaviorInternal(name, behavior)
  }

  attachBehaviors(behaviors: BehaviorObj) {
    this.ensureBehaviors()

    Object.keys(behaviors).map(name => {
      this.attachBehaviorInternal(name, behaviors[name])
    })
  }

  detachBehavior(name: string): Behavior | null {
    this.ensureBehaviors()

    if (this.behaviors[name]) {
      const behavior = this.behaviors[name]
      delete this.behaviors[name]
      behavior.detach()
      return behavior
    }

    return null
  }

  detachBehaviors(): void {
    this.ensureBehaviors()
    Object.keys(this.behaviors).map(name => {
      this.detachBehavior(name)
    })
  }

  private attachBehaviorInternal(name: string, behavior: Behavior): Behavior {
    if (this.behaviors[name]) {
      this.behaviors[name].detach()
    }

    behavior.attach(this)
    this.behaviors[name] = behavior

    return behavior
  }
}
