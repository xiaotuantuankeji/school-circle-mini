import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import request from './common/request'
import api from './api/index'
import configData from './common/config'
import Base64 from './common/Base64'
import storage from './common/storage'
import util from './common/util'
// import uuidData from './common/uuid_data'
// import errCodeMsg from './common/err_code_msg'
// import toPage from './common/gotoPage'
import wechatAuth from './libs/wechat_auth'
// import wechatShare from './libs/wechat_share'
// import wechatLocation from './libs/wechat_location'

import './uni.promisify.adaptor'

Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$api = api
Vue.prototype.$configData = configData
Vue.prototype.$Base64 = Base64
Vue.prototype.$storage = storage
Vue.prototype.$util = util
// Vue.prototype.$uuidData = uuidData
// Vue.prototype.$errCodeMsg = errCodeMsg
// Vue.prototype.$toPage = toPage
Vue.prototype.$wechatAuth = wechatAuth;
// Vue.prototype.$wechatShare = wechatShare;
// Vue.prototype.$wechatLocation = wechatLocation;

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
    createSSRApp
} from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif