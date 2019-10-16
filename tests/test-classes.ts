export class A {
  public b: B | null
  constructor(b?: B) {
    this.b = b || null
  }
}

export class B {
  public a: A | null
  constructor(a?: A) {
    this.a = a || null
  }
}

interface EngineInterface {
  getName(): string
  setNumber(value: number): void
  getNumber(): number
}

export class EngineMarkOne implements EngineInterface {
  public name: string = 'engine mark one'

  private number: number = 0

  getName() {
    return this.name
  }

  setNumber(value: number) {
    this.number = value
  }

  getNumber() {
    return this.number
  }
}

export class EngineMarkTwo implements EngineInterface {
  public name: string = 'engine mark two'

  private number: number = 0

  getName() {
    return this.name
  }

  setNumber(value: number) {
    this.number = value
  }

  getNumber() {
    return this.number
  }
}

export class ConstructorTest {
  private params: any[]

  public constructor(parameter: any) {
    this.params = parameter
  }

  public getParameter() {
    return this.params
  }
}

export class PropertyTest {
  [key: string]: any
}
