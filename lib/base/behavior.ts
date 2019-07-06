import Component from "./component";

// import Component from './component'
interface $Events {
  [key: string]: any
}

export default class Behavior {
  public owner: Component | null

  constructor() {
    this.owner = null
  }

  events(): $Events {
    return {}
  }

  attach(owner: Component): void {
    this.owner = owner
    this.tach('on')
  }

  detach(): void {
    if (this.owner) {
      this.tach('off')
      this.owner = null
    }
  }

  private tach(type: 'on' | 'off') {
    const events: $Events = this.events()

    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const fn: Function = (<Component>this.owner)[type]
        fn(event, events[event])
      }
    }
  }
}
