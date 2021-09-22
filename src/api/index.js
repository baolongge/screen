import Ajax from './request'

// 创建权限信息接口实例
const authorityApi = new Ajax({
    baseUrl: '/screen',
    reqSuccessKey: 'resultCode',
    reqSuccessValue: '100',
    msgKey: 'resultMsg',
    // interceptError: redirectToLogin
})

export const office = (params) => authorityApi.post('/user/login', { ...params })
