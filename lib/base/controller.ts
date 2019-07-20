import { Component } from './component'
import { Context } from 'koa'
import { isString, isObject } from 'util'
import { Action } from './action'

export interface ControllerWithParams {
  __class: Controller
  [key: string]: any
}


export abstract class Controller extends Component {
  public defaultAction: string
  public actionParams: any[]
  public abstract layout: string
  public abstract action: Action

  constructor(public ctx: Context, public id: string, public module: string) {
    super()
    this.defaultAction = 'index'
    this.actionParams = []
  }

  get body() {
    return this.ctx.body
  }

  set body(body: string) {
    this.ctx.body = body
  }

  get ip() {
    return this.ctx.ip
  }

  get ips() {
    return this.ctx.ips
  }

  get status() {
    return this.ctx.status
  }

  set status(status) {
    this.ctx.status = status
  }

  get type() {
    return this.ctx.type
  }

  set type(contentType) {
    this.ctx.type = contentType
  }

  get userAgent() {
    return this.ctx.userAgent
  }

  get method() {
    return this.ctx.method
  }

  get isGet() {
    return this.ctx.isGet
  }

  get isPost() {
    return this.ctx.isPost
  }

  get isCli() {
    return this.ctx.isCli
  }

  /**
   * is method
   */
  isMethod(method: string) {
    return this.ctx.isMethod(method)
  }

  /**
   * check if is ajax request
   */
  isAjax(method: string) {
    return this.ctx.isAjax(method)
  }

  /**
   * is jsonp request
   * @param {String} callback
   */
  isJsonp(callback: string) {
    return this.ctx.isJsonp(callback)
  }

  /**
   * send jsonp data
   */
  jsonp(data: string, callback: string) {
    return this.ctx.jsonp(data, callback)
  }

  /**
   * send json data
   */
  json(data: string) {
    return this.ctx.json(data)
  }

  /**
   * send success data
   */
  success(data: string, message: string) {
    return this.ctx.success(data, message)
  }

  /**
   * send fail data
   */
  fail(errno: number, errmsg: string, data: string) {
    return this.ctx.fail(errno, errmsg, data)
  }

  /**
   * set expires header
   */
  expires(time: number) {
    return this.ctx.expires(time)
  }

  /**
   * get query data
   * @param {String} name
   * @param {Mixed} value
   */
  get(name: string, value: any) {
    return this.ctx.param(name, value)
  }
  /**
   * get query data
   */
  query(name: string, value: any) {
    return this.ctx.param(name, value)
  }
  /**
   * get or set post data
   */
  post(name: string, value: any) {
    return this.ctx.post(name, value)
  }

  /**
   * get or set file data
   */
  file(name: string, value: any) {
    return this.ctx.file(name, value)
  }

  /**
   * get or set cookies
   */
  cookie(name: string, value: string, options: object) {
    return this.ctx.cookie(name, value, options)
  }

  /**
   * get or set header
   */
  header(name: string, value: any) {
    if (value === undefined && isString(name)) {
      return this.ctx.header[name]
    }

    if (this.ctx.res.headersSent) {
      // debug(`headers has already sent, url: ${this.ctx.url}`)
      return
    }
    if (value !== undefined) {
      return this.ctx.set(name, value)
    }

    if (isObject(name)) {
      return this.ctx.set(<{}>name)
    }
  }

  /**
   * get referer header
   */
  referrer(onlyHost: string) {
    return this.ctx.referer(onlyHost)
  }
  /**
   * get referer header
   */
  referer(onlyHost: string) {
    return this.ctx.referer(onlyHost)
  }

  /**
   * Perform a 302 redirect to `url`.
   */
  redirect(url: string, alt: string) {
    this.ctx.redirect(url, alt)
    return false
  }

  /**
   * download
   */
  download(filepath: string, filename: string) {
    return this.ctx.download(filepath, filename)
  }

  actions(): ActionMap {
    return {}
  }

  abstract createAction(id: string): Action | null

  abstract bindActionParams(): any[]

  getApp() {

  }

  getUniqueId() {

  }
}

interface ActionMap {
  [key: string]: Action
}
