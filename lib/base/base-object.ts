interface iBaseObject {
  [key: string]: any
}


export class BaseObject {
  private _proxy: any
  
  constructor() {
    this._proxy = new Proxy(this, {
      get: function(obj: iBaseObject, name: string) {
        const $getter = `get${name}`
        if (typeof obj[$getter] === 'function') {
          return obj[$getter]()
        }
        
        const setter = `set${name}`
        if (typeof obj[setter] === 'function') {
          
        }
      },
      set: function(obj, name, value) {

      }
    })
  }
}