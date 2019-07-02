import Component from './component'


export default abstract class Action extends Component {
  private _controller: Controller

  constructor() {
    super()
  }
}
