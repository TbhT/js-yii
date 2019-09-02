import { ConfigureObj } from './configurable'
import { Container } from '../di/container'

export interface IndexedObj {
  [key: string]: any
}

export interface IndexedFnObj {
  [key: string]: (...arg: any[]) => void
}

export default class BaseYii {
  /**
   * the dependcy injection (DI) container used by [[createObject]].
   * You may use [[Container::set()]] to set up the needed dependencies
   * of classes and their initial property values
   *
   * @see createObject()
   * @see Container
   */
  public static container: Container

  public static version: string = '0.1.0'

  /**
   * Creates a new object using the given configuration.
   * 
   * ```javascript
   * 
   * // create an object using a configuration
   * $object = Yii.createObject({
   *  'class' => Connection,
   *  'host' => '127.0.0.1',
   *  'username' => 'root',
   *  'password' => '',
   *  'charset' => 'utf8'
   * })
   * ```
   */
  public static createObject(configure: ConfigureObj) {
    // todo: di container

    if (typeof configure === 'function') {
      return BaseYii
    }
  }
}
