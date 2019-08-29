import { ConfigureObj } from './configurable'

export interface IndexedObj {
  [key: string]: any
}

export interface IndexedFnObj {
  [key: string]: (...arg: any[]) => void
}


class BaseYii {
  // public static container

  public static createObject(configure: ConfigureObj | object) {
    // todo: di container

    if (typeof configure === 'function') {
      return BaseYii
    }
  }
}
