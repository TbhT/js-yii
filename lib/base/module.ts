import { Component } from './component'
import { Controller, ControllerWithParams } from './controller'
import { Application } from './application'

export interface ControllerMap {
  [key: string]: Controller | ControllerWithParams
}

export abstract class Module extends Component {
  constructor(public id: string, parent: Module) {
    super()
    this._app = parent.getApp()
    this._container = this._app.getContainer()
    this.module = parent
  }

  public params = []

  public controllerMap: ControllerMap = {}

  /**
   * parent module
   */
  public module: Module | null = null

  public layout: string | boolean = ''

  public defaultRoute: string = 'default'

  private _basePath: string = ''

  private _viewPath: string = ''

  private _layoutPath: string = ''

  /**
   * child modules
   */
  private _modules: Module[] = []

  private _version: string = ''

  protected _container: Container

  protected _app: Application

  getApp(): Application {
    return this._app
  }

  getUniqueId(): string {
    return !!this.module ? `${this.module.getUniqueId()}/${this.id}/` : this.id
  }

  getBasePath(): string {
    if (this._basePath === '') {
      this._basePath = __dirname
    }

    return this._basePath
  }

  setBasePath(path) {
    path = this._app.getAlias()
    // todo: path
  }

  getControllerPath() {
    // todo:
  }

  getViewPath(): string {
    if (this._viewPath === '') {
      this._viewPath = `${this.getBasePath()}/views`
    }

    return this._viewPath
  }

  setViewPath(path: string) {
    this._viewPath = this._app.getAlias(path)
  }

  getLayoutPath(): string {
    if (this._layoutPath === '') {
      this._layoutPath = `${this.getViewPath()}/layouts`
    }

    return this._layoutPath
  }

  setLayoutPath(path: string) {
    this._layoutPath = path
  }

  protected defaultVersion() {
    if (this.module === null) {
      return '1.0'
    }

    return this.module.getVersion()
  }

  getVersion(): string {
    if (this._version === '') {
      this._version = this.defaultVersion()
    }

    return this._version
  }

  setVersion(version: string) {
    this._version = version
  }

  setAliases() {
    // todo: 
  }

  hasModule(id: string) {

  }

  getModule() {

  }

  setModule() {

  }

  getModules() {

  }

  setModules() {

  }

  runAction() {

  }

  createController() {

  }

  createControllerById() {

  }

  beforeAction() {

  }

  afterAction() {

  }

  get() {

  }

  has() {
    
  }
}
