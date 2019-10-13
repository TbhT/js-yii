import { ContainerErrorInterface, NotFoundErrorInterface } from '../di/container'

/**
 * InvalidConfigError is thrown when configuration
 * passed to container is not valid
 */
export class InvalidConfigError extends Error
  implements ContainerErrorInterface {}

/**
 * CircularReferenceError is thrown when DI configuration
 * contains self-reference of any level and thus could
 * not be resolved.
 */
export class CircularReferenceError extends Error
  implements ContainerErrorInterface {}

/**
 * NotFoundError is thrown when no entry was found in
 * the container
 */
export class NotFoundError extends Error implements NotFoundErrorInterface {}

/**
 * NotInstantiableError represents an exception caused by incorrect dependencies
 * injection container configuration or usage
 */
export class NotInstantiableError extends Error
  implements ContainerErrorInterface {}
