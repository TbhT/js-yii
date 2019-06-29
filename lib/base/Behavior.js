module.exports = class {
  constructor() {
    this.owner = null
  }

  events() {
    return {}
  }

  /**
   * @param {Component} owner
   */
  attach(owner) {
    this.owner = owner
    this._tach(this.owner.on)
  }

  detach() {
    if (this.owner) {
      this._tach(this.owner.off)
    }
  }

  _tach(handle) {
    const events = this.events()
    for (const event in events) {
      if (object.hasOwnProperty(event)) {
        const handler = events[event]
        handle(event, handler)
      }
    }
  }
}
