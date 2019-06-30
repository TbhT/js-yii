const Component = require('./Component')
const debug = require('debug')('js-yii')

module.exports = class extends Component {
  constructor(ctx) {
    this.ctx = ctx
    this.defaultAction = 'index'
    this.actionParams = []
  }

  get body() {
    return this.ctx.body
  }

  set body(value) {
    this.ctx.body = value
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

  set status(value) {
    this.ctx.status = value
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
   * @param {String} method
   */
  isMethod(method) {
    return this.ctx.isMethod(method)
  }
  /**
   * check if is ajax request
   * @param {String} method
   */
  isAjax(method) {
    return this.ctx.isAjax(method)
  }
  /**
   * is jsonp request
   * @param {String} callback
   */
  isJsonp(callbackField) {
    return this.ctx.isJsonp(callbackField)
  }
  /**
   * send jsonp data
   */
  jsonp(data, callbackField) {
    return this.ctx.jsonp(data, callbackField)
  }
  /**
   * send json data
   */
  json(data) {
    return this.ctx.json(data)
  }
  /**
   * send success data
   */
  success(data, message) {
    return this.ctx.success(data, message)
  }
  /**
   * send fail data
   */
  fail(errno, errmsg, data) {
    return this.ctx.fail(errno, errmsg, data)
  }
  /**
   * set expires header
   * @param {Number} time
   */
  expires(time) {
    return this.ctx.expires(time)
  }
  /**
   * get query data
   * @param {String} name
   * @param {Mixed} value
   */
  get(name, value) {
    return this.ctx.param(name, value)
  }
  /**
   * get query data
   * @param {String} name
   * @param {Mixed} value
   */
  query(name, value) {
    return this.ctx.param(name, value)
  }
  /**
   * get or set post data
   * @param {String} name
   * @param {Mixed} value
   */
  post(name, value) {
    return this.ctx.post(name, value)
  }

  /**
   * get or set file data
   * @param {String} name
   * @param {Mixed} value
   */
  file(name, value) {
    return this.ctx.file(name, value)
  }

  /**
   * get or set cookies
   * @param {String} name
   * @param {String} value
   * @param {Object} options
   */
  cookie(name, value, options) {
    return this.ctx.cookie(name, value, options)
  }

  /**
   * get or set header
   * @param {String} name
   * @param {Mixed} value
   */
  header(name, value) {
    if (value === undefined && helper.isString(name)) {
      return this.ctx.header[name]
    }
    if (this.ctx.res.headersSent) {
      debug(`headers has already sent, url: ${this.ctx.url}`)
      return
    }
    if (value !== undefined) {
      return this.ctx.set(name, value)
    }
    if (helper.isObject(name)) {
      return this.ctx.set(name)
    }
  }
  /**
   * get referer header
   */
  referrer(onlyHost) {
    return this.ctx.referer(onlyHost)
  }
  /**
   * get referer header
   */
  referer(onlyHost) {
    return this.ctx.referer(onlyHost)
  }
  /**
   * Perform a 302 redirect to `url`.
   * @param {String} url
   * @param {String} alt
   */
  redirect(url, alt) {
    this.ctx.redirect(url, alt)
    return false
  }

  /**
   * download
   * @param {String} filepath
   * @param {String} filename
   */
  download(filepath, filename) {
    return this.ctx.download(filepath, filename)
  }

  /**
   * @public
   */
  actions() {
    return {}
  }

  

}
