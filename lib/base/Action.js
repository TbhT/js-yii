const Component = require('./Component')
const debug = require('debug')('js-yii')

module.exports = class extends Component {
  constructor(id, controller) {
    this._controller = controller
    this._id = id
  }

  getApp() {
    return this._controller.getApp()
  }

  getUniqueId() {
    return this._controller.getUniqueId() + '/' + this._id
  }

  runWithParams(...params) {

    if (!this.run) {
      throw new Error('derived Action Class must implement run() method')
    }

    const args = this._controller.bindActionParams(this, ...params)
    debug(`Running action: ${this}.run()`)

    if (this.beforeRun()) {
      const result = this.run(...args)
      this.afterRun()
      return result
    }

    return null
  }

  beforeRun() {
    return true
  }

  afterRun() {}
}
