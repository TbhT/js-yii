const Component = require('./Component')
const debug = require('debug')('js-yii')

module.exports = class extends Component {
  constructor(controller) {
    this._controller = controller
  }

  runWithParams(...params) {
    if (!this.run) {
      throw new Error('derived Action class must implement run() method')
    }

    debug(`Running action: ${this}.run()`)
    
  }

  beforeRun() {
    return true
  }

  afterRun() {}
}
