import axios from 'axios'
import router from '../router/index'
import {message} from "ant-design-vue";

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(config => {
    // config.headers['Authorization'] = getToken()
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        message.error('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.code != "00000") {
        if (res.data.message) {
            message.error(res.data.message)
        }
        // 登录已过期
        if (res.data.code == 'A0230') {
            router.push({ path: '/user' })
        }

        return Promise.reject(res.data)
    }

    return res.data
}, error => {
    message.error('网络异常！')
    console.log(error)
    Promise.reject(error)
})

export default axios