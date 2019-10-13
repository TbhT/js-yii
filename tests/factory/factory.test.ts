import { Factory } from '../../src/factory'
import { ContainerInterface } from '../../src/container'

function createContainer() {
  return new (class implements ContainerInterface {
    get() {
      return {}
    }

    has(id: any) {
      return false
    }
  })()
}

interface EngineInterface {
  getName(): string
  setNumber(number: number): void
  getNumber(): number | undefined
}

class EngineMarkOne implements EngineInterface {
  private number: number | undefined = undefined
  public readonly NAME: string = 'Mark One'

  public getName(): string {
    return this.NAME
  }

  public setNumber(number: number): void {
    this.number = number
  }

  public getNumber(): number | undefined {
    return this.number
  }
}

class EngineMarkTwo implements EngineInterface {
  private number: number | undefined = undefined
  public readonly NAME: string = 'Mark Two'

  public getName(): string {
    return this.NAME
  }

  public setNumber(number: number): void {
    this.number = number
  }

  public getNumber(): number | undefined {
    return this.number
  }
}

describe('Factory test cases', () => {
  it('should be created by alias', () => {
    const factory = new Factory(createContainer(), {
        'engine': EngineMarkOne
    })

    const one = factory.create('engine')
    const two = factory.create('engine')

    expect(one === two).toBeFalsy()
  })
})
