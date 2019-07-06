import { Component } from './component'
import { Controller } from './controller'

export abstract class Module extends Component {
  constructor(public id: string, parent: Module) {
    super()

  }

  public params = []

  public controllerMap: Controller[] = []

  getApp() {
    return this.app
  }
}
