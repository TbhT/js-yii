import { BaseObject } from './base-object'
import { EventEmitter } from 'events'
import { Behavior } from './behavior'
import { delegatorForComponent } from './delegator'

interface BehaviorObj {
  [key: string]: Behavior
}

export class Component extends BaseObject {
  private _behaviors: BehaviorObj = {}

  private e: EventEmitter

  constructor() {
    super()
    this.e = new EventEmitter()
    return delegatorForComponent()
  }

  behaviors(): BehaviorObj {
    return {}
  }

  on(event: string | symbol, listener: (...arg: any[]) => void): void {
    this.ensureBehaviors()

    this.e.on(event, listener)
  }

  off(event: string | symbol, listener: (...arg: any[]) => void): void {
    this.ensureBehaviors()

    this.e.off(event, listener)
  }

  emit(event: string | symbol, ...args: any[]): void {
    this.ensureBehaviors()

    this.e.emit(event, args)
  }

  getBehavior(name: string): Behavior {
    this.ensureBehaviors()

    return this._behaviors[name] || null
  }

  getBehaviors() {
    return this._behaviors
  }

  ensureBehaviors() {
    if (Object.keys(this._behaviors).length > 0) {
      const behaviors = this.behaviors()
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

    if (this._behaviors[name]) {
      const behavior = this._behaviors[name]
      delete this._behaviors[name]
      behavior.detach()
      return behavior
    }

    return null
  }

  detachBehaviors(): void {
    this.ensureBehaviors()
    Object.keys(this._behaviors).map(name => {
      this.detachBehavior(name)
    })
  }

  private attachBehaviorInternal(name: string, behavior: Behavior): Behavior {
    if (this._behaviors[name]) {
      this._behaviors[name].detach()
    }

    behavior.attach(this)
    this._behaviors[name] = behavior

    return behavior
  }
}
