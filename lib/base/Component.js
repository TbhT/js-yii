const { EventEmitter } = require('events')

module.exports = class extends EventEmitter {
  constructor() {
    this._behaviors = null
  }

  /**
   *
   * @param {string} name
   * @param {Behavior} behavior
   * @private
   */
  _attachBehaviorInternal(name, behavior) {
    if (this._behaviors[name]) {
      this._behaviors[name].detach()
    }

    behavior.attach(this)
    this._behaviors[name] = behavior
  }

  /**
   * @param {Behavior} behaviors
   * @private
   */
  _attachBehaviorsInternal(behaviors) {
    for (const name in behaviors) {
      if (behaviors.hasOwnProperty(name)) {
        this._attachBehaviorInternal(name, behaviors[name])
      }
    }
  }

  /**
   * @public
   */
  behaviors() {
    return {}
  }

  /**
   * @public
   */
  attachBehaviors() {
    if (this._behaviors === null) {
      this._behaviors = {}
      this._attachBehaviorsInternal(this.behaviors())
    }
  }
}
