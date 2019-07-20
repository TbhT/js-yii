import { Module } from './module'
import { Controller } from './controller'

export abstract class Application extends Module {
  /**
   * current active controller instance
   */
  public controller: Controller | null = null

  public layout: string | null = null

  public reqRoute: string

  public reqAction: string

  public reqParams: any[]

  public extentions: any[]

  protected req

  protected res
}
