import axios from 'axios'
// import Vue from 'vue'
import { obj2query } from '@/util'
import { local, session } from '@/util/storage.js'
import { ElNotification, ElMessageBox } from 'element-plus';


class AJAX {
    constructor(cfg) {
        // 成功标志key
        this.reqSuccessKey = cfg.reqSuccessKey
        // 成功标志value
        this.reqSuccessValue = cfg.reqSuccessValue
        // 消息key
        this.msgKey = cfg.msgKey
        // 文件下载
        this.downloadType = cfg.hasOwnProperty('downloadType') ? cfg.downloadType : false
        // 文件上传
        this.contentType = cfg.hasOwnProperty('contentType') ? cfg.contentType : false
        // 拦截错误
        this.interceptError = cfg.interceptError
        this.instance = axios.create({
            baseURL: cfg.baseUrl,
            timeout: 30000
        })
        this.invalidToken = false
        // 请求与响应拦截方法，对象初始化时执行
        this.initInterceptors(this.downloadType)
    }

    get(url, params, successCb, config) {
        return this.fetch(url, params, successCb, 'get', config)
    }
    post(url, params, successCb, config) {
        return this.fetch(url, params, successCb, 'post', config)
    }
    put(url, params, successCb, config) {
        return this.fetch(url, params, successCb, 'put', config)
    }
    delete(url, params, successCb, config) {
        return this.fetch(url, params, successCb, 'delete', config)
    }
    fetch(url, params, successCb, method, config) {
        if (config) this.instance.defaults = Object.assign(this.instance.defaults, config)
        let instance = method === 'get' ? this.instance.get(url + obj2query(params)) : this.instance[method](url, params)
        return instance.then((res) => {

            // 自定义成功回调
            if (successCb) {
                successCb(res)
                return
            }
            // console.log(res)
            // 正常流程,  由于后端有同一接口适用两个字段表示响应码所以这里做个临时兼容，后续拆分个小版本对下响应码字典
            let code = res && (res[this.reqSuccessKey] || res.resultCode || res.code)
            if (this.reqSuccessValue.indexOf(code) > -1) {
                return Promise.resolve(res, code)
            } else {
                // let msg = res && res[this.msgKey] || res['message'] || JSON.stringify(res) || '错误类型未知'
                let msg = res && (res[this.msgKey] || res['message'] || '错误类型未知')
                if (code !== 40005) {
                    code !== 40005 && res && ElNotification({
                        title: '错误提示',
                        message: msg,
                        type: 'error'
                    })
                }
                else {
                    console.error('接口无权限访问')
                }

                return Promise.reject(res)
            }
        }).catch((error) => {
            return Promise.reject(error)
        })
    }


    initInterceptors(downloadType) {
        // 接口request拦截器
        this.instance.interceptors.request.use(config => {
            var xtoken = local.get('token')
            if (xtoken) {
                config.headers['Authorization'] = xtoken
            }
            if (downloadType === 'blob') {
                config['responseType'] = downloadType
            }
            if (this.contentType === 'multipart/form-data') {
                config.headers['Content-Type'] = this.contentType
            }
            // config.headers['sourceType'] = '1002' // B端请求头 
            return config
        })
        // 接口response拦截器
        this.instance.interceptors.response.use((response) => {
            // 判断是否有新的token返回，重置本地token
            response.headers.hasOwnProperty('authorization') && local.set('token', response.headers.authorization)
            // 判断是否存在下载文件名
            response.headers.hasOwnProperty('content-disposition') && session.set('cardOrder', response.headers['content-disposition'].split(';')[1].split('filename=')[1])
            response = response.data
            let callbackFn = this.interceptError
            // 校验授权失败
            // if (response.code === 405 || response.code === 200) {
            if (['40006', '40009', '1001'].includes(String(response[this.reqSuccessKey]))) {
                if (this.invalidToken) return
                if (String(response[this.reqSuccessKey]) === '40006') { local.remove('token') }
                if (window.location.pathname === '/') {
                    // 根目录不提示，直接重定向到单点登录页
                    callbackFn && callbackFn()
                } else {
                    ElMessageBox('您的登录信息已过期，请重新登录！', '提示', {
                        confirmButtonText: '确定',
                        callback: function () {
                            callbackFn && callbackFn()
                        }
                    })
                }
                // 标记登录过期
                this.invalidToken = true
            } else {
                typeof response === 'object' && (response.success = Number(response.resultCode) === 100)
                return response
            }
        }, (error) => {
            error = error.response
            let msg = '请求服务失败'
            let duration = 4500

            if (error && error.status) {
                msg += `，错误码${error.status}`
            } else {
                msg = '请求超时，请检查网络~'
                duration = 0
            }
            ElNotification({
                type: 'error',
                title: '错误提示',
                message: msg,
                duration
            })
            return Promise.reject(error)
        })
    }
}
export default AJAX
