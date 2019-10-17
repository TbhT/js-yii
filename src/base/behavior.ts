import { BaseObject } from './base-object'
import { Component } from './component'
import { EventEmitter } from 'events'
import { ConfigureObj } from './configurable'
import { IndexedFnObjType } from './base-yii'

export class Behavior extends BaseObject {
  public owner: Component | null = null

  private e: EventEmitter

  constructor(config: ConfigureObj) {
    super(config)
    this.e = new EventEmitter()
  }

  static events(): IndexedFnObjType {
    return {}
  }

  attach(owner: Component): void {
    this.owner = owner

    const events = Behavior.events()

    Object.keys(events).map(eventName => owner.on(eventName, events[eventName]))
  }

  detach() {
    if (this.owner !== null) {
      const events = Behavior.events()

      Object.keys(events).map(eventName =>
        (<Component>this.owner).off(eventName, events[eventName])
      )
    }
  }
}
