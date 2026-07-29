<script>
    import request from './common/request'
    import api from './api/index'
    import config from './common/config'
    import { websocketManager } from './libs/websocket'

    export default {
        data() {
            return {
                unreadCountInterval: null,
                isWebSocketConnected: false,
                _wsHandlersRegistered: false
            }
        },
        onLaunch: function() {
            // this.startUnreadCountTimer()
        },
        onShow: function() {
            this.getUnreadCount()
            this.startUnreadCountTimer()
            this.initWebSocket()
        },
        onLaunch: function() {
            // 监听登录成功事件
            uni.$on('loginSuccess', () => {
                this.initWebSocket()
            })
        },
        onHide: function() {
            this.stopUnreadCountTimer()
            this.disconnectWebSocket()
        },
        onUnload: function() {
            this.stopUnreadCountTimer()
            this.disconnectWebSocket()
        },
        methods: {
            // 初始化 WebSocket
            initWebSocket() {
                const token = this.$storage.token.get()
                if (!token) {
                    console.log('[WebSocket] 未登录,跳过连接')
                    return
                }

                console.log('[WebSocket] 开始初始化...')

                // 注册处理器（只注册一次）
                if (!this._wsHandlersRegistered) {
                    this._wsHandlersRegistered = true

                    // 注册未读消息变化处理器
                    websocketManager.onMessage('school_unread_count_change', (data) => {
                        console.log('[WebSocket] 收到未读消息变化通知,刷新未读数')
                        this.getUnreadCount()
                    })

                    // 连接成功回调
                    websocketManager.onConnect(() => {
                        console.log('[WebSocket] 连接成功,停止轮询')
                        this.isWebSocketConnected = true
                        this.stopUnreadCountTimer()
                    })

                    // 连接断开回调
                    websocketManager.onDisconnect(() => {
                        console.log('[WebSocket] 连接断开,启动轮询降级')
                        this.isWebSocketConnected = false
                        this.startUnreadCountTimer()
                    })
                }

                // 连接 WebSocket
                websocketManager.connect(config.websocket_url, token)
            },

            // 断开 WebSocket
            disconnectWebSocket() {
                console.log('[WebSocket] 断开连接')
                websocketManager.disconnect()
                this.isWebSocketConnected = false
            },

            // 开始定时获取未读消息数
            startUnreadCountTimer() {
                // 如果 WebSocket 已连接,不启动轮询
                if (this.isWebSocketConnected) {
                    console.log('[Unread] WebSocket 已连接,跳过轮询')
                    return
                }
                // 清除之前的定时器
                this.stopUnreadCountTimer()
                // 每30秒获取一次未读消息数
                this.unreadCountInterval = setInterval(() => {
                    this.getUnreadCount()
                }, 30000)
            },
            // 停止定时获取未读消息数
            stopUnreadCountTimer() {
                if (this.unreadCountInterval) {
                    clearInterval(this.unreadCountInterval)
                    this.unreadCountInterval = null
                }
            },
            getUnreadCount() {
                const userInfo = this.$storage.user.get();
                if (userInfo && userInfo.studentId) {
                    const param = 'studentId=' + userInfo.studentId;
                    api.getUnreadCount(param).then(res => {
                        // console.log('getUnreadCount-data:' + JSON.stringify(res.data))
                        // {
                        //   "commentCount": 0,
                        //   "commentId": null,
                        //   "likeCount": 0,
                        //   "likeId": null,
                        //   "collectCount": 0,
                        //   "collectId": null,
                        //   "playmateCommentCount": 0,
                        //   "playmateCommentId": null,
                        //   "systemCount": 4,
                        //   "messageId": 10,
                        //   "list": [
                        //     {
                        //       "groupId": 3,
                        //       "unreadNumber": 2
                        //     }
                        //   ],
                        //   "groupId": 3
                        // }
                        if (res.data) {
                            const data = res.data

                            this.$storage.unread.set(data)

                            const commentCount = parseInt(data.commentCount)
                            const likeCount = parseInt(data.likeCount)
                            const collectCount = parseInt(data.collectCount)
                            const playmateCommentCount = parseInt(data.playmateCommentCount)
                            const playmateMemberCount = parseInt(data.playmateMemberCount)
                            const systemCount = parseInt(data.systemCount)
                            const list = data.list
                            let listCount = 0
                            if (list.length > 0) {
                                for (let i = 0; i < list.length; i++) {
                                    const obj = list[i]
                                    const unreadNumber = parseInt(obj.unreadNumber)
                                    listCount = listCount + unreadNumber
                                }
                            }

                            const total = commentCount + likeCount + collectCount + playmateCommentCount +
                                playmateMemberCount + systemCount + listCount
                            console.log('getUnreadCount_total:' + total)
                            if (total > 0) {
                                const badgeText = total > 99 ? '99+' : total.toString();
                                uni.setTabBarBadge({
                                    index: 1, // 消息tab的索引
                                    text: badgeText
                                });
                            } else {
                                uni.removeTabBarBadge({
                                    index: 1
                                });
                            }
                        } else {
                            uni.removeTabBarBadge({
                                index: 1
                            });
                        }
                    }).catch(res => {
                        // 获取未读消息数失败
                    })
                }
            }
        }
    };
</script>

<style lang="scss">
    @import '@/uni_modules/uni-scss/index.scss';

    /*每个页面公共css */
    page {
        background-color: #FFFFFF;
    }

    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/uni.css';

    /* H5 兼容 pc 所需 */
    /* #ifdef H5 */
    @media screen and (min-width: 768px) {
        body {
            overflow-y: scroll;
        }
    }

    /* 顶栏通栏样式 */
    /* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

    uni-page-body {
        background-color: #FFFFFF !important;
        min-height: 100% !important;
        height: auto !important;
    }

    .uni-top-window uni-tabbar .uni-tabbar {
        background-color: #FFFFFF !important;
    }

    .uni-app--showleftwindow .hideOnPc {
        display: none !important;
    }

    /* #endif */

    /* #endif */
</style>