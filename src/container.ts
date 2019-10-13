/**
 * base interface representing a generic Error in a container
 */
export interface ContainerErrorInterface {}

/**
 * no entry was found in the container
 */
export interface NotFoundErrorInterface
  extends ContainerErrorInterface {}

export interface ContainerInterface {
  /**
   * finds an entry of the container by its identifier and return it
   *
   * @param id identifier of the entry to look for
   * @throws NotFoundErrorInterface
   * @throws ContainerErrorInterface
   */
  get(id: string): object | undefined

  /**
   * return true if the container can return an entry for the given identifier
   * return false otherwise
   *
   * @param {string} id identifier
   * @returns {boolean}
   */
  has(id: string): boolean
}
