module.exports = class {
  constructor() {
    this.owner = null
  }

  /**
   * @public
   */
  events() {
    return {}
  }

  /**
   * @param {Component} owner
   * @public
   */
  attach(owner) {
    this.owner = owner
    this._tach('on')
  }

  /**
   * @public
   */
  detach() {
    if (this.owner) {
      this._tach('off')
    }
  }

  /**
   * @param {string} type
   * @private
   */
  _tach(type) {
    const events = this.events()
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const handler = events[event]
        this.owner[type](event, handler)
      }
    }
  }
}
