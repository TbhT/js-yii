import { Component } from './component'
import { Controller } from './controller'
import debug from 'debug'

export abstract class Action extends Component {
  private _controller: Controller
  private _id: string

  constructor(id: string, controller: Controller) {
    super()
    this._controller = controller
    this._id = id
  }

  getApp() {
    return this._controller.getApp()
  }

  getUniqueId() {
    return this._controller.getUniqueId() + '/' + this._id
  }

  beforeRun() {
    return true
  }

  abstract run(...args: any[]): any

  afterRun() {}

  runWithParams(...params: any[]) {
    const args = this._controller.bindActionParams(...params)
    debug(`Running action: ${this}.run()`)

    if (this.beforeRun()) {
      const result = this.run(...args)
      this.afterRun()
      return result
    }

    return null
  }
}
