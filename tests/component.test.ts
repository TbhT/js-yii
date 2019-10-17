import { Component } from '../src/base/component'
import { ProxyComponent } from '../src/base/delegator'

describe('Component', function() {
  it('should be a instanceof MyComponent', function() {
    class MyComponent extends Component {
      public $hello = 1

      getHello() {
        return 'this is getHello method'
      }

      setHello(value: any) {
        this.$hello = value
      }
    }
    const c = new MyComponent()

    expect(c instanceof MyComponent).toBe(true)
  })

  it('should call getFn and setFn', function() {
    const get = 'this is a get'
    const set = 'this is a set'

    class MyComponent extends Component {
      $hello:any = 1

      constructor() {
        super()
      }

      getHello() {
        return get
      }

      setHello(value: any) {
        this.$hello = value
      }
    }

    const c = ProxyComponent(new MyComponent())
    expect(c.Hello).toBe(get)
    c.Hello = set
    expect(c.$hello).toBe(set)
  })
})
