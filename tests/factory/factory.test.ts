import { Factory } from '../../src/factory'
import { ContainerInterface } from '../../src/container'
import { Reference, IndexableObj } from '../../src/factory/definitions'

class TestContainer implements ContainerInterface {
  get() {
    return {}
  }

  has(id: any) {
    return false
  }
}

function createContainer() {
  return new TestContainer()
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
      engine: EngineMarkOne
    })

    const one = factory.create('engine')
    const two = factory.create('engine')

    expect(one === two).toBe(false)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(two).toBeInstanceOf(EngineMarkOne)
  })

  it('should be singleton', () => {
    const factory = new Factory(createContainer(), {
      engine: new EngineMarkOne()
    })

    const one = factory.create('engine')
    const two = factory.create('engine')

    expect(one).toEqual(two)
    expect(one).toBeInstanceOf(EngineMarkOne)
  })

  it('should be created by class', () => {
    const factory = new Factory(createContainer())
    const one = factory.create(EngineMarkOne)
    const two = factory.create(EngineMarkOne)

    expect(one === two).toBe(false)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(two).toBeInstanceOf(EngineMarkOne)
  })

  it('should be got by alias', () => {
    const factory = new Factory(createContainer(), {
      engine: EngineMarkOne
    })

    const one = factory.get('engine')
    const two = factory.get('engine')

    expect(one === two).toBe(false)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(two).toBeInstanceOf(EngineMarkOne)
  })

  it('should be trivial definition', () => {
    const factory = new Factory(createContainer())
    factory.set(EngineMarkOne, EngineMarkOne)
    const one = factory.get(EngineMarkOne)
    const two = factory.get(EngineMarkOne)
    expect(one === two).toBe(false)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(one).toBeInstanceOf(EngineMarkOne)
  })

  it('should be got by class', () => {
    const factory = new Factory(createContainer())
    const one = factory.get(EngineMarkOne)
    const two = factory.get(EngineMarkOne)
    expect(one === two).toBe(false)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(two).toBeInstanceOf(EngineMarkOne)
  })

  it.skip('is that factory in container', () => {
    const container = createContainer()
    const factory = new Factory(container, {
      factory: {
        className: Factory,
        args: [Reference.to('factor')]
      }
    })

    const one = factory.create('factory')
    const two = factory.create('factory')
    expect(one === two).toBe(false)
    expect(one === factory).toBe(false)
    expect(one).toBeInstanceOf(Factory)
    expect(two).toBeInstanceOf(Factory)
  })
})
