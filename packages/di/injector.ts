import { ContainerInterface } from './container'
import { NormalizeType } from '../factory/definitions'
import { EventEmitter } from 'events'

export class Injector extends EventEmitter {
  public constructor(private container: ContainerInterface) {
    super()
  }

  public invoke(dependencies: NormalizeType[], callback: CallableFunction) {
    dependencies = dependencies.filter(dependency => {
      return this.container.has(dependency)
    })

    try {
      callback(...dependencies)
    } catch (error) {
      this.emit('error', error)
    }
  }
}
