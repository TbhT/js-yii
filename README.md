# Document

- DI



## DI

### using Container

The usage of DI Container is fairly simple.

```javascript

const container = new Container({
    'fullDefinition': {
        className: EngineMarkOne,
        args: ['param1'],
        property1: 'property1'
    },
    'object': new EngineMarkOne()
})

container.set('set_alias', EngineMarkOne)

container.set('set_alias', {
    className: EngineMarkOne,
    args: ['param1']
})

const obj = container.get('set_alias')

console.log(obj instanceof EngineMarkOne) // true

```

### using service providers

### using deferred service providers

### further reading

- [Martin Fowler's article](http://martinfowler.com/articles/injection.html).
