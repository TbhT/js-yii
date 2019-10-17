/**
 * Exception represents a generic exception for all purposes
 */
export class Exception extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Exception'
  }
}

/**
 * ErrorException represents a nodejs error
 */
export class ErrorException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ErrorException'
  }
}

/**
 * ExitException represents a normal termination of an application.
 */
export class ExitException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExitException'
  }
}

/**
 * InvalidArgumentException represents an exception caused by
 * invalid arguments passed to a method
 */
export class InvalidArgumentException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidArgumentException'
  }
}

/**
 * InvalidCallException represents an exception caused by
 * calling a method in a wrong way.
 */
export class InvalidCallException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidCallException'
  }
}

/**
 * InvalidConfigException represents an exception caused by
 * incorrect object configuration.
 */
export class InvalidConfigException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidConfigException'
  }
}

/**
 * InvalidRouteException represents an exception caused by
 * an invalid route.
 */
export class InvalidRouteException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRouteException'
  }
}

/**
 * InvalidValueException represents an exception caused by
 * a function returning a value of unexpected type.
 */
export class InvalidValueException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidValueException'
  }
}

/**
 * NotSupportedException represents an exception caused by
 * accessing features that are not supported.
 */
export class NotSupportedException extends Exception {
  constructor(message: string) {
    super(message)
    this.name = 'NotSupportedException'
  }
}

/**
 * UnknownClassException represents an exception caused by
 * using an unknown class.
 */
export class UnknownClassException extends Exception {
  constructor(message: string) {
    super(message)
    this.name = 'UnknownClassException'
  }
}

/**
 * UnknownMethodException represents an exception caused by
 * accessing an unknown object method.
 */
export class UnknownMethodException extends Exception {
  constructor(message: string) {
    super(message)
    this.name = 'UnknownMethodException'
  }
}

/**
 * UnknownPropertyException represents an exception caused by accessing unknown object properties.
 */
export class UnknownPropertyException extends Exception {
  constructor(message: string) {
    super(message)
    this.name = 'UnknownPropertyException'
  }
}

export abstract class UserException extends Exception {
  public abstract name: string
  public abstract message: string
}
