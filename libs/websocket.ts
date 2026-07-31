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

/**
 * WebSocket 管理器
 * 负责连接管理、断线重连、消息处理
 */

class WebSocketManager {
  private ws: any = null
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private url: string = ''
  private token: string = ''
  private isManualClose: boolean = false
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private connectCallbacks: (() => void)[] = []
  private disconnectCallbacks: (() => void)[] = []
  private _handlersRegistered: boolean = false
  private _connected: boolean = false

  /**
   * 注册消息处理器（全局只注册一次）
   */
  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  /**
   * 连接成功回调（全局只注册一次）
   */
  onConnect(callback: () => void) {
    this.connectCallbacks.push(callback)
  }

  /**
   * 连接断开回调（全局只注册一次）
   */
  onDisconnect(callback: () => void) {
    this.disconnectCallbacks.push(callback)
  }

  /**
   * 连接 WebSocket
   */
  connect(url: string, token: string) {
    this.url = url
    this.token = token
    this.isManualClose = false

    // 如果已连接,跳过
    if (this._connected) {
      console.log('[WebSocket] 已连接,跳过重复连接')
      return
    }

    try {
      // 构建 WebSocket URL (token 作为 URL 参数)
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`
      console.log('[WebSocket] 正在连接:', wsUrl)

      // 使用 uni.connectSocket 兼容微信小程序
      this.ws = uni.connectSocket({
        url: wsUrl,
        complete: () => {}
      })

      if (!this._handlersRegistered) {
        this._handlersRegistered = true
        this.setupGlobalHandlers()
      }
    } catch (error) {
      console.error('[WebSocket] 连接失败:', error)
      this.scheduleReconnect()
    }
  }

  /**
   * 设置全局事件处理器（只设置一次）
   */
  private setupGlobalHandlers() {
    uni.onSocketOpen(() => {
      console.log('[WebSocket] 连接成功')
      this._connected = true
      this.clearReconnectTimer()
      this.startHeartbeat()
      this.connectCallbacks.forEach(cb => cb())
    })

    uni.onSocketMessage((res: { data: string }) => {
      try {
        const message = JSON.parse(res.data)
        console.log('[WebSocket] 收到消息:', message.type)

        const { type, content } = message
        if (type && this.messageHandlers.has(type)) {
          const handler = this.messageHandlers.get(type)!
          handler(content)
        }
      } catch (error) {
        console.error('[WebSocket] 消息解析失败:', error)
      }
    })

    uni.onSocketError((error) => {
      console.error('[WebSocket] 发生错误:', error)
    })

    uni.onSocketClose((res) => {
      console.log('[WebSocket] 连接关闭, code:', res.code, 'reason:', res.reason)
      this._connected = false
      this.stopHeartbeat()

      if (!this.isManualClose) {
        console.log('[WebSocket] 准备重连...')
        this.scheduleReconnect()
        this.disconnectCallbacks.forEach(cb => cb())
      }
    })
  }

  /**
   * 开始心跳
   */
  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this._connected) {
        uni.sendSocketMessage({
          data: JSON.stringify({ type: 'ping' }),
          fail: () => {}
        })
      }
    }, 30000) // 30秒心跳
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect() {
    this.clearReconnectTimer()
    this.reconnectTimer = setTimeout(() => {
      console.log('[WebSocket] 尝试重连...')
      this.connect(this.url, this.token)
    }, 5000) // 5秒后重连
  }

  /**
   * 清除重连定时器
   */
  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * 发送消息
   */
  send(data: any) {
    if (this._connected) {
      uni.sendSocketMessage({
        data: JSON.stringify(data),
        fail: () => {}
      })
    } else {
      console.warn('[WebSocket] 未连接,无法发送消息')
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.isManualClose = true
    this._connected = false
    this.clearReconnectTimer()
    this.stopHeartbeat()
    if (this.ws) {
      uni.closeSocket()
      this.ws = null
    }
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this._connected
  }
}

// 导出单例
export const websocketManager = new WebSocketManager()
