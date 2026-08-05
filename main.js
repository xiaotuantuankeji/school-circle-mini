/*
 * Copyright 2026 南京校团团科技有限公司
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
// #ifndef H5
import wechatAuth from './libs/wechat_auth'
// #endif
// #ifdef H5
import wechatAuth from './libs/wechat_auth_h5'
// #endif
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