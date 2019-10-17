import { Component } from './component'
import ViewContextInterface from './view-context-interface'
import { ConfigureObj } from './configurable'
import Module from './base-modules'

export default class Controller extends Component
  implements ViewContextInterface {
  constructor(public id: string, public m: Module, config: ConfigureObj = {}) {
    super(config)
  }
}
