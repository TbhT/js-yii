import { EventEmitter } from 'events'
import Behavior from './behavior'

interface Behaviors {
  [key: string]: Behavior
}

export abstract class Component extends EventEmitter {
  private _behaviors: Behaviors | null

  constructor() {
    super()
    this._behaviors = null
  }

  private attachBehaviorInternal(name: string, behavior: Behavior) {
    if ((<Behaviors>this._behaviors)[name]) {
      ;(<Behaviors>this._behaviors)[name].detach()
    }

    behavior.attach(this)
    ;(<Behaviors>this._behaviors)[name] = behavior
  }

  private attachBehaviorsInternal(behaviors: Behaviors) {
    for (const behavior in behaviors) {
      if (behaviors.hasOwnProperty(behavior)) {
        this.attachBehaviorInternal(name, behaviors[behavior])
      }
    }
  }

  // behaviors(): Behaviors {
  //   return {}
  // }

  abstract behaviors(): Behaviors

  attachBehaviors() {
    if (this._behaviors === null) {
      this._behaviors = {}
      this.attachBehaviorsInternal(this.behaviors())
    }
  }
}
