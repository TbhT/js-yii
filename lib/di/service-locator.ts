import { Component } from '../base/component'

interface ComponentsObj {
  [key: string]: Component
}



export class ServiceLocator extends Component {

  // shared component instances indexed by their IDs
  private components: ComponentsObj = {}

  private definitions = {}

  
}
