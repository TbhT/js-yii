import { Container } from '../src/di/container'
import { InvalidConfigError } from '../src/factory/exceptions'
import { Reference } from '../src/factory/definitions'

class A {
  constructor(public b: B) {}
}

class B {
  constructor(public a: A) {}
}

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

  it('is optional circular class dependencies', () => {
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
})
