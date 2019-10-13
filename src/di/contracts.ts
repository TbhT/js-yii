import { Container } from './container'

interface ServiceProviderInterface {
  register(container: Container): void
}

interface DeferredServiceProviderInterface extends ServiceProviderInterface {
  hasDefinitionFor(id: string): boolean
}
