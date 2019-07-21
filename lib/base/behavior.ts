import { BaseObject } from './base-object'
import { Component } from './component'
import { EventEmitter } from 'events'
import { ConfigureObj } from './configurable'
import { IndexedFnObj } from './base-yii'

export class Behavior extends BaseObject {
  public owner: Component | null = null

  private e: EventEmitter

  constructor(config: ConfigureObj) {
    super(config)
    this.e = new EventEmitter()
  }

  events(): IndexedFnObj {
    return {}
  }

  attach(owner: Component): void {
    this.owner = owner

    const events = this.events()

    Object.keys(events).map(eventName => {
      owner.on(eventName, events[eventName])
    })
  }

  detach() {
    if (this.owner !== null) {
      this.events
    }
  }
}
