/**
 * Configurable is the interface that should be implemented by 
 * classes who support configuring its properties through the 
 * last parameter to its constructor.
 * 
 * The interface does not declare any method. Classes implementing this interface must declare their constructors
 * like the following:
 * 
 * ```javascript 
 * constructor(param1, param2, param3, ..., config = []) 
 * ```
 * 
 * That is, the last parameter of the constructor must accept a configuration array.
 */
export interface Configurable {
  [key: string]: any
}

type Keys = 'class'

type Configure = {
  [key in Keys]: object
}

export interface ConfigureObj {
  [key: string]: Configure
}