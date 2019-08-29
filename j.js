class A {
  constructor() {
    this.a = 'this is a '
    return { world: 'the world is me, hello' }
  }

  hello(name) {
    console.log(name)
  }

  static [Symbol.hasInstance](instance) {
    return instance.__type === 'A'
  }
}

class B {}

const proxyA = new Proxy(A, {
  construct(target, args) {
    const t = new target(...args)
    t.__type = 'AA'
    return t
  }
})

// console.log(
// console.log((new proxyA).proxyType)
console.log((new proxyA) instanceof A)
// console.log(proxyA.prototype)

// const aObj = new A
// console.log(aObj instanceof A)
// module.exports = A

// module.exports = new Proxy(new A, {
//   get(obj, name) {
//     console.log('>>>', name)
//     if (typeof obj[name] === 'function') {
//       return obj[name]
//     } else {
//       console.log('-------------------')
//     }
//   }
// })
