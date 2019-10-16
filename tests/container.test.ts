import { Container } from '../src/di/container'
import { InvalidConfigError } from '../src/factory/exceptions'
import { Reference } from '../src/factory/definitions'
import {
  A,
  B,
  EngineMarkOne,
  EngineMarkTwo,
  ConstructorTest,
  PropertyTest
} from './test-classes'

describe('Container class', () => {
  it('should throw invalid error', () => {
    function throwInvalidError() {
      const container = new Container({
        scalar: 123
      })

      container.get('scalar')
    }

    expect(throwInvalidError).toThrowError(InvalidConfigError)
  })

  it.todo('implement optional dependencies')

  it.skip('is optional circular class dependencies', () => {
    const container = new Container()
    container.set('a', {
      className: A,

      args: [B]
    })
    container.set('b', {
      className: B,
      args: [A]
    })
    const a: A = <A>container.get('a')
    expect(a.b).toBeInstanceOf(B)
  })

  it('should be false without definition', () => {
    const container = new Container()

    const hasEngine = container.has(EngineMarkOne)
    expect(hasEngine).toBe(false)

    const engine = container.get(EngineMarkOne)
    expect(engine).toBeInstanceOf(EngineMarkOne)
  })

  it('test trivial definition', () => {
    const container = new Container()
    container.set(EngineMarkOne, EngineMarkOne)
    const one = container.get(EngineMarkOne)
    const two = container.get(EngineMarkOne)
    expect(one).toBeInstanceOf(EngineMarkOne)
    expect(one).toBe(two)
  })

  it('test class simple', () => {
    const container = new Container()
    container.set('engine', EngineMarkOne)
    const one = container.get('engine')
    expect(one).toBeInstanceOf(EngineMarkOne)
  })

  it('should set all', () => {
    const container = new Container()
    container.setMultiple({
      engine1: EngineMarkOne,
      engine2: EngineMarkTwo
    })
    expect(container.get('engine1')).toBeInstanceOf(EngineMarkOne)
    expect(container.get('engine2')).toBeInstanceOf(EngineMarkTwo)
  })

  it('test class constructor', () => {
    const container = new Container()
    container.set('constructor_test', {
      className: ConstructorTest,
      args: ['hello']
    })
    const obj = <ConstructorTest>container.get('constructor_test')
    expect(obj.getParameter()).toBe('hello')
  })

  it('test class properties', () => {
    const container = new Container()
    container.set('property_test', {
      className: PropertyTest,
      hello: 123
    })

    const obj = <PropertyTest>container.get('property_test')
    expect(obj.hello).toBe(123)
  })

  it('test alias', () => {
    const container = new Container()
    container.set('engine-mark-one', Reference.to('engine'))
    container.set('engine', EngineMarkOne)
    const engineMarkOne = container.get('engine-mark-one')
    const engine = container.get('engine')
    expect(engineMarkOne).toBeInstanceOf(EngineMarkOne)
    expect(engine).toBeInstanceOf(EngineMarkOne)
  })
})
