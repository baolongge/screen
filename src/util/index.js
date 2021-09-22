/**
 * 以下为公共函数集合
 */

import moment from 'moment'



// 对象克隆
export function DeepCopy(obj) {
  let str
  let newobj
  if (typeof obj !== 'object') {
    return obj
  } else if (window.JSON) {
    str = JSON.stringify(obj)
    newobj = JSON.parse(str)
  } else {
    newobj = obj.constructor === Array ? [] : {}
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? DeepCopy(obj[i]) : obj[i]
    }
  }
  return newobj
}

/**
 * 深度拷贝v2
 * @param {Object} obj 
 * @param {any} cache   防止死循环
 */
export function deepCopyV2(obj, cache) {
  if (cache === void 0) { cache = [] }
  if (obj === null || typeof obj !== 'object') { return obj }
  let hit = cache.filter(function (c) {
    return c.original === obj
  })[0]
  if (hit) { return hit.copy }
  let copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy: copy
  })
  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopyV2(obj[key], cache)
  })
  return copy
}

/**
 * 获取值类型
 * @param val 被检验值类
 * @return type 返回类型
 * @returns 返回值（'null', 'undefined', 'Numer', 'String', 'Boolean', 'Object', 'Array'）
 */
export function getValueType(val) {
  if (val === null) {
    return 'null'
  }
  if (typeof val === 'undefined') {
    return 'undefined'
  }
  let typeStr = Object.prototype.toString.call(val)
  let reg = /\[object\s(\S*)]$/g
  let type = typeStr.replace(reg, (val, $1) => $1)
  return type
}

export function valueTypeTransform(val, toValueType) {
  // 可支持转换的值类型
  let typeArr = [String, Number, Boolean, Array]
  if (typeArr.indexOf(toValueType) === -1) {
    throw new Error('所需转换值的类型未知')
  }
  if (val instanceof toValueType) {
    return val
  }
  if (toValueType === Array) {
    return [val]
  } else {
    return toValueType(val)
  }
}

export function valueTypeTransformAll(params, formRule) {
  let paramsTarget = {}
  let copy = formRule
  if (params) {
    for (let key in params) {
      let ruleItem = copy.find((item) => {
        return item.id.indexOf(key) > -1
      })
      if (ruleItem && ruleItem['type']) {
        paramsTarget[key] = valueTypeTransform(params[key], ruleItem['type'])
      }
    }
    return paramsTarget
  }
}

/**
 * 判断为空（null、undefined、'' 返回true）
 * 0 返回 false
 */
export function isEmpty(str) {
  if (typeof str === 'undefined') {
    return true
  } else if (str === null) {
    return true
  } else if (str.length === 0) {
    return true
  } else {
    return false
  }
}


/**
 * @description: 判断是否是String类型
 * @author: xiemin
 * @param {type}
 * @return:
 */
export function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]'
}

/**
 * @description: 判断是否是Array类型
 * @author: xiemin
 * @param {type}
 * @return:
 */
export function isArray(val) {
  return val instanceof Array
}

/**
 * @description: 判断是否是Object类型
 * @author: xiemin
 * @param {type}
 * @return:
 */
export function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * @description: 判断是否是Function类型
 * @author: xiemin
 * @param {type}
 * @return:
 */
export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]'
}

export function isDate(val) {
	return Object.prototype.toString.call(val) === '[object Date]'
}
export function getPersent(val) {
  if (isNumber(val)) {
    val = (Math.round(val * 10000) / 100).toFixed(2)
  }
  return val
}

export function priceToFen(val) {
  if (isEmpty(val)) {
    return ''
  }
  val = Math.round(val * 10000) / 100
  return val
}

export function priceToYuan(val) {
  if (isEmpty(val)) {
    return ''
  }
  let price = Number(val) / 100
  return Number(price.toFixed(2))
}
// 以元为单位的价格转化为人民币货币值 如 23000.00 => ￥2,3000.00
export function yuanToCurrency(val) {
  if (isEmpty(val)) {
    return 0
  }
  val = Number(val)
  return val.toLocaleString('zh-Hans-CN', {
    style: 'currency',
    currency: 'CNY'
  })
}

export function isNumber(value) {
  let patrn = /^(-)?\d+(\.\d+)?$/
  if (patrn.exec(value) === null || value === '') {
    return false
  } else {
    return true
  }
}

export function parseParam(url, params) {
  let link = []
  for (let key in params) {
    if (!isEmpty(params[key])) {
      link.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    }
  }
  url += link.length > 0 ? `?${link.join('&')}` : ''
  return url
}

/**
 * 对象转key-value数组
 * @params obj 处理对象
 * @params [{val: '', label: ''}]
 * @params keyToInt key转init
 */
export function objToArray(obj, val = 'val', label = 'label', keyToInt = true) {
  let arr = []
  getValueType(obj) === 'Object' && Object.keys(obj).forEach(key => {
    let item = {}
    item[val] = keyToInt ? Number(key) : key
    item[label] = obj[key]
    arr.push(item)
  })
  return arr
}

/**
 * 创建数组options
 * descrition 对象转数组，默认第一项添加全部选择
 */
export function createOptions(obj) {
  let all = {
    label: '全部',
    val: ''
  }
  return [all, ...objToArray(obj)]
}

/**
 * 获取对象key集合
 * @param obj 处理对象
 * @param type 处理输出类型 ，默认String
 * @return Array {a: 1, b: 2} => [1, 2]
 */
export function getKeyList(obj = {}, handleType = String) {
  let arr = []
  Object.keys(obj).forEach(key => {
    arr.push(handleType(key))
  })
  return arr
}

export function DeepCopyByObj(obj = {}, target) {
  var tempObj = {}
  var result
  Object.keys(obj).forEach((key) => {
    tempObj[key] = target[key]
  })
  result = DeepCopy(tempObj)
  tempObj = null
  return result
}

export function setHourData(scope) {
  let arr = []
  // 计数 用于计算小时
  let num = 0
  for (let i = 0; i < 48; i++) {
    // 单双判断 00||30
    let minute = ''
    let hour = ''
    if (i % 2 === 0 && i !== 0) {
      num++
    }
    if (i < 20) {
      hour = '0' + num
    } else {
      hour = num
    }

    if (i % 2 === 0) {
      minute = ':00'
    } else {
      minute = ':30'
    }
    // hour + minute 小时 + 分钟
    arr.push({ value: hour + minute, label: hour + minute })
  }
  if (scope === 'end') {
    arr.shift()
    arr.push({ value: '23:59', label: '23:59' })
  }
  return arr
}


export function debounce(func, wait, immediate) {
  // immediate默认为false
  var timeout
  var args
  var context
  var timestamp
  var result

  var now = function () {
    return +new Date()
  }

  var later = function () {
    // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    var last = now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function () {
    context = this
    args = arguments
    timestamp = now()
    // 第一次调用该方法时，且immediate为true，则调用func函数
    var callNow = immediate && !timeout
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function sleep(wait) {
  return new Promise(resolve => {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, wait)
  })
}

export function obj2query(obj) {
  if (obj && Object.keys(obj).length > 0) {
    let str = '?'
    Object.keys(obj).forEach((key) => {
      let val = obj[key]
      if (typeof val === 'object') {
        val = JSON.stringify(val)
      }
      str = str + key + '=' + val + '&'
    })
    return str.substr(0, str.length - 1)
  } else {
    return ''
  }
}

export function query2object(queryStr) {
  queryStr = queryStr.replace(/^\?/, '')
  let strs = queryStr.split('&')
  let query = {}
  for (var i = 0; i < strs.length; i++) {
    query[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
  }
  return query
}

/**
 * @description: 下载url返回的文件流
 * @author: xiemin
 * @param {String} url 文件链接
 * @param {String} fileName
 */
export function downloadUrl(url, fileName) {
  var a = document.createElement('a') // 转换完成，创建一个a标签用于下载
  a.download = fileName
  a.href = url
  a.style.display = 'none'
  document.body.appendChild(a) // 兼容firefox
  a.click()
  document.body.removeChild(a)
}
/**
 * @description: 树形json数据转一维数组
 * @author: you.deng
 * @param {*} nodes json二维数组
 */
export function jsonToArray(nodes) {
  var r = []
  if (Array.isArray(nodes)) {
    for (var i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]) // 取每项数据放入一个新数组
      if (Array.isArray(nodes[i]['children']) && nodes[i]['children'].length > 0) {
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(jsonToArray(nodes[i]['children']))
        delete nodes[i]['children']
      }
    }
  }
  return r
}

/**
 * 从 url 上获取 key/value
 * @param  {String} url 默认 decode 2次的 window.location.href
 * @param  {String} key key
 * @return [String, Null]     key 对应的 value 默认 null
 */
export const parseUrl = (url, key) => {
  if (!url) {
    url = decodeURIComponent(decodeURIComponent(window.location.href)) // 中文需 decode 2次
  }

  let exp = new RegExp(`[?&]${key}(=([^&#]*)|&|#|$)`)
  let results = exp.exec(url)

  if (!results || !results[2]) {
    return null
  }

  return decodeURIComponent(results[2])
}

export function hasClass(obj, cls) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export function addClass(obj, cls) {
  if (!hasClass(obj, cls)) obj.className += ' ' + cls
}

export function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    obj.className = obj.className.replace(reg, ' ')
  }
}

/**
 * 根据时间范围计算出包含天数日期
 * @param {Number} startstamp 
 * @param {Number} endstamp 
 * @returns []
 */
export function getAllDate(startstamp, endstamp) {
  let dateArr = []
  let stamp
  const oneDay = 24 * 60 * 60 * 1000
  for (stamp = startstamp; stamp <= endstamp;) {
    dateArr.push(moment(stamp).format('YYYY-MM-DD'))
    stamp += oneDay
  }
  return dateArr
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns []
 */
export function uniqueArray(arr) {
  let result = []
  let obj = {}

  for (let i of arr) {
    if (!obj[i]) {
      result.push(i)
      obj[i] = 1
    }
  }
  return result
}

/**
 * [setCookie 设置cookie]
 * [key value t 键 值 过期时间（默认30天）]
 * 
 */
export function setCookie(key, value, day = 30) {
  let oDate = new Date()
  oDate.setTime(oDate.getTime() + day * 24 * 60 * 60 * 1000)
  document.cookie = key + '=' + value + '; expires=' + oDate.toGMTString()
}
/**
* [getCookie 获取cookie]
*/
export function getCookie(key) {
  var arr1 = document.cookie.split('; ')// 由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
  for (var i = 0; i < arr1.length; i++) {
    var arr2 = arr1[i].split('=')// 通过=截断，把name=Jack截断成[name,Jack]数组；
    if (arr2[0] === key) {
      return decodeURI(arr2[1])
    }
  }
}
/**
* [removeCookie 移除cookie]
*/
export function removeCookie(key) {
  setCookie(key, '', -1) // 把cookie设置为过期
};

function getWeekStr(i) {
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  return `周${arr[i]}`
}
/**
 * 获取时间及周信息
 */
export function getWeekObj(time = new Date(), arr = [0, 1, 2, 3, 4, 5, 6], callBack = v => v) {
  return [...arr.map(callBack).sort((a, b) => { return a - b }).map(v => {
    const now = new Date(time).getTime() + 24 * 60 * 60 * 1000 * v
    return {
      current: moment(now).format('YYYY-MM-DD'),
      day: new Date(now).getDate(),
      weekDay: moment(now).format('YYYY-MM-DD') === moment(new Date().getTime()).format('YYYY-MM-DD') ? '今天' : getWeekStr(new Date(now).getDay())
    }
  })]
}


export function random(MIN, MAX) {
  return Math.floor(Math.random() * (MAX - MIN)) + MIN
}

/**
 * 数组对象转为字符串
 * @param {Array} list 
 * @param {String} key 
 */
export function arrToString(list, key, split = '，') {
  if (isEmpty(list) || isEmpty(key)) {
    return
  }
  let string = ''
  list && list.forEach(item => {
    string += item[key] + split
  })
  return string.substring(0, string.length - 1)
}


/**
 * 校验文件大小不超过2MB
 * @param {object} file 
 */
export function checkFile(file, that, size = 2, showToast = true) {
  const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  if ((file.size / 1024 / 1024) > size) {
    showToast && that.$message.error(`图片大小不能超过 ${size}MB!`)
    return false
  } else if (!isType) {
    that.$message.error('只能支持jpg，png，jpeg!')
    return false
  } else {
    return true
  }
}



/**
 * @description: 迭代器
 * @author: duanlang
 * @param {function} gen 生成器函数
 * @return {*}
 */
export function thread(gen) {
  let it = gen()
  function next(data) {
    let res = it.next(data)
    if (res.done) return res.value
    res.value.then(function (res) {
      next(data)
    }).catch(function (e) {
      res = it.next(data)
      next(data)
    })
  }
  next()
}
/**
 * @description: base64转换Blob字节
 * @author: duanlang
 * @param {string} base64
 * @return {string} 
 */
export function base64ToBlob(base64) {
  if (!base64) return
  let arr = base64.split(',')
  let match = arr[0].match(/:(.*?);/)
  if (!match || !match.length) return
  let mime = arr[0].match(/:(.*?);/)[1] || 'image/png'
  let bytes = window.atob(arr[1])
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  let blob = new Blob([ab], {
    type: mime
  })
  let formdata = new FormData()
  let _filename = new Date().getTime() + '.png'
  formdata.append('file', blob, _filename)
  return formdata
}

/**
 * @description: 元数据转换
 * @author: duanlang
 * @param {array} list 一个元数据
 * @param {object} transformOptions 需要转换的字段
 * @param {boolean} merge 是否和元数据的字段合并
 * @return {array} 
 * @example transformFields([{a:1, b:2}, {a:3,b:5}], {id:"a", name:"b"}) =>  [{id:1,name:2}, {id:3,name:5}]
 */
export const transformFields = (list = [], transformOptions = {}, merge = false) => {
  if (!list) return []
  return list.reduce((prev, cur) => {
    const field = {}
    Object.keys(transformOptions).forEach(key => {
      field[key] = cur[transformOptions[key]]
    })
    merge ? prev.push(Object.assign({}, cur, field)) : prev.push(field)
    return prev
  }, [])
}

/**
 * * 场景
 * await http({...})	某情况下抛出异常 下面的代码就不会执行了
 * dosomething...
 *  解决这个问题可以使用trycatch, 但是如果n个trycatch就很不友好
 * try {
 * 		await promise() 
 * 		.....
 * }catch(e){}
 * 以下封装便是为了解决这个问题的
 * @description 解决抛出异常做的处理
 * @author: duanlang
 * @param {*} promise 异步函数
 * @returns 
 * @example const [err, data] = await to(promise)
 * 
 */
export const to = (promise) => {
  if (typeof promise.then !== 'function') {
    let _promise = new Promise((resolve, reject) => {
      resolve(promise)
    })
    return to(_promise)
  }
  return promise.then(data => {
    return [null, data]
  }).catch(err => [err])
}


// reduxJs 组合多个高阶函数
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * 下载文件
 * @param {String} fileName 文件名
 * @param {String} blob 二进制流
 * @returns 
 */
export const h5Download = async (fileName, blob) => {
  function saveFile(data, filename) {
    let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    saveLink.href = data
    saveLink.download = filename
    
    const event = document.createEvent('MouseEvents')
    event.initMouseEvent('click')
    saveLink.dispatchEvent(event)
  }

  const reader = new FileReader()
  reader.readAsDataURL(blob) // 转换为base64，可以直接放入a标签href
  reader.onload = function (e) {
    const data = e.target.result
    saveFile(data, fileName)
  }
}

