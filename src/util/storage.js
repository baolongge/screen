/**
 * @params key [String]
 * @params value [String]
 * @params needConvert [Boolean] 是否需求转换
 */
function set(key, value, needConvert = false) {
  // 针对浏览器隐身模式下会抛出的异常
  value = needConvert ? JSON.stringify(value) : value
  try {
    this._storage.setItem(key, value)
  } catch (ex) {
    console.warn('[session]:save data fail!')
  }
}

function get(key, needConvert = false) {
  let value = this._storage.getItem(key) || ''
  return needConvert && value
    ? JSON.parse(value)
    : value
}

function remove(key) {
  this._storage.removeItem(key)
}

function clear() {
  this._storage.clear()
}

export const session = {
  _storage: window.sessionStorage,
  set,
  get,
  remove,
  clear
}
export const local = {
  _storage: window.localStorage,
  set,
  get,
  remove,
  clear
}
