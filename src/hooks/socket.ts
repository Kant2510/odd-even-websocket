import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReadyState, UseWebSocketOptions, UseWebSocketReturn } from '../types/socket'
import { defaultParse, clamp, jitter } from '../utils/socket'

/**
 * Refactored WebSocket hook with:
 * - Reconnect (exponential backoff + jitter)
 * - Heartbeat ping
 * - Message queue before OPEN
 * - Safe JSON parsing and rich API
 */
export default function useWebSocket<TParsed = unknown>(
    socketUrl: string | null | undefined,
    opts?: UseWebSocketOptions<TParsed>
): UseWebSocketReturn<TParsed> {
    const options = useMemo<Required<UseWebSocketOptions<TParsed>>>(
        () => ({
            shouldReconnect: true,
            maxRetries: 10,
            backoffBaseMs: 500,
            backoffMaxMs: 10_000,
            heartbeatEnabled: true,
            heartbeatIntervalMs: 25_000,
            heartbeatMessage: 'PING',
            maxMessages: 0,
            parse: defaultParse,
            protocols: 'ws',
            debug: true,
            ...opts,
        }),
        [opts]
    )

    // Giữ lại đối tượng WebSocket
    const wsRef = useRef<WebSocket | null>(null)
    // Lưu trữ timer cho reconnect
    const reconnectTimerRef = useRef<number | null>(null)
    // Lưu trữ khoảng thời gian cho heartbeat
    const heartbeatTimerRef = useRef<number | null>(null)
    // Cờ để kiểm tra kết nối có bị đóng thủ công không
    const manuallyClosedRef = useRef(false)
    // Lưu trữ số lần kết nối lại
    const retriesRef = useRef(0)
    // Lưu trữ hàng đợi tin nhắn nếu WebSocket chưa kết nối
    const queueRef = useRef<(string | ArrayBufferLike | Blob | ArrayBufferView)[]>([])

    const [readyState, setReadyState] = useState<ReadyState>(WebSocket.CLOSED)
    const [messages, setMessages] = useState<string[]>([])
    const [parsedMessages, setParsedMessages] = useState<TParsed[]>([])
    const [lastMessage, setLastMessage] = useState<string | null>(null)
    const [lastParsedMessage, setLastParsedMessage] = useState<TParsed | null>(null)
    const [error, setError] = useState<Event | null>(null)
    const [retries, setRetries] = useState(0)

    /** In ra log debug nếu debug được bật */
    const debugLog = useCallback(
        (...args: any[]) => {
            if (options.debug) console.log('[useWebSocket]', ...args)
        },
        [options.debug]
    )

    /** Xóa các timer cho việc kết nối lại và heartbeat */
    const clearTimers = useCallback(() => {
        if (reconnectTimerRef.current) {
            window.clearTimeout(reconnectTimerRef.current)
            reconnectTimerRef.current = null
        }
        if (heartbeatTimerRef.current) {
            window.clearInterval(heartbeatTimerRef.current)
            heartbeatTimerRef.current = null
        }
    }, [])

    /** Gửi các tin nhắn heartbeat (PING) định kỳ đến máy chủ nếu kết nối đang mở.
        Hàm startHeartbeat đảm bảo rằng một tin nhắn "PING" được gửi định kỳ (mỗi heartbeatIntervalMs mili giây) để duy trì kết nối WebSocket. 
        Tin nhắn heartbeat có thể được tùy chỉnh thông qua tùy chọn heartbeatMessage
    */
    const startHeartbeat = useCallback(() => {
        clearTimers()
        if (!options.heartbeatIntervalMs || !options.heartbeatEnabled) return
        heartbeatTimerRef.current = window.setInterval(() => {
            const ws = wsRef.current
            if (ws && ws.readyState === WebSocket.OPEN) {
                const msg =
                    typeof options.heartbeatMessage === 'function'
                        ? options.heartbeatMessage()
                        : options.heartbeatMessage
                try {
                    ws.send(msg)
                    debugLog('→ Heartbeat sent')
                } catch (e) {
                    debugLog('Heartbeat send failed', e)
                }
            }
        }, options.heartbeatIntervalMs)
    }, [clearTimers, options.heartbeatIntervalMs, options.heartbeatMessage, debugLog])

    /** Gửi các tin nhắn từ hàng đợi nếu WebSocket đã mở */
    const flushQueue = useCallback(() => {
        const ws = wsRef.current
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        while (queueRef.current.length) {
            const data = queueRef.current.shift()!
            try {
                ws.send(data)
            } catch (e) {
                debugLog('Failed to flush queued item', e)
                break
            }
        }
    }, [debugLog])

    /** Đóng kết nối WebSocket, có thể với mã trạng thái và lý do */
    const disconnect = useCallback(
        (code?: number, reason?: string) => {
            manuallyClosedRef.current = true
            clearTimers()
            const ws = wsRef.current
            if (ws) {
                try {
                    ws.close(code ?? 1000, reason ?? 'Client disconnect')
                } catch {
                    debugLog('Error while closing WebSocket', ws)
                }
                wsRef.current = null
            }
            setReadyState(WebSocket.CLOSED)
        },
        [clearTimers]
    )

    /** Lên lịch kết nối lại với độ trễ theo cơ chế backoff và jitter
        Nếu kết nối WebSocket bị đóng một cách bất ngờ (và shouldReconnect là true), 
        hàm scheduleReconnect sẽ cố gắng kết nối lại. 
        Độ trễ giữa các lần thử kết nối lại tuân theo cơ chế backoff exponential và jitter, 
        và số lần thử lại bị giới hạn bởi maxRetries
    */
    const scheduleReconnect = useCallback(() => {
        if (!options.shouldReconnect || manuallyClosedRef.current) return
        const attempt = retriesRef.current + 1
        if (attempt > options.maxRetries) return

        const delay = clamp(
            options.backoffBaseMs * Math.pow(2, attempt - 1),
            options.backoffBaseMs,
            options.backoffMaxMs
        )
        const wait = jitter(delay)
        debugLog(`Reconnecting in ~${wait}ms (attempt ${attempt}/${options.maxRetries})`)
        reconnectTimerRef.current = window.setTimeout(() => {
            retriesRef.current = attempt
            setRetries(attempt)
            // fresh connect
            if (socketUrl) connect()
        }, wait)
    }, [options.shouldReconnect, options.maxRetries, options.backoffBaseMs, options.backoffMaxMs, debugLog, socketUrl])

    /** Thiết lập một kết nối WebSocket mới hoặc bỏ qua nếu kết nối hiện tại đang hoạt động. Đồng thời thiết lập các sự kiện cho onopen, onmessage, onerror, và onclose
     */
    const connect = useCallback(() => {
        if (!socketUrl) return
        if (
            wsRef.current &&
            (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
        ) {
            debugLog('Skip connect: existing socket is active')
            return
        }

        manuallyClosedRef.current = false
        setError(null)

        let ws: WebSocket
        try {
            debugLog('Creating new WebSocket:', socketUrl, options.protocols)
            ws = new WebSocket(socketUrl, options.protocols)
        } catch (e) {
            debugLog('WS constructor failed', e)
            // scheduleReconnect()
            return
        }

        wsRef.current = ws
        setReadyState(ws.readyState)

        // Thiết lập trạng thái kết nối là OPEN, bắt đầu gửi heartbeat, và gửi các tin nhắn trong hàng đợi
        ws.onopen = () => {
            debugLog('WS open')
            setReadyState(WebSocket.OPEN)
            retriesRef.current = 0
            setRetries(0)
            startHeartbeat()
            flushQueue()
        }

        // Xử lý tin nhắn nhận được (phân tích nếu cần) và cập nhật các trạng thái tin nhắn
        ws.onmessage = (ev: MessageEvent) => {
            const raw = typeof ev.data === 'string' ? ev.data : ''
            setLastMessage(raw)
            setMessages((prev) => {
                const next = [...prev, raw]
                if (options.maxMessages > 0 && next.length > options.maxMessages) next.shift()
                return next
            })

            const parsed = raw ? options.parse(raw) : null
            if (parsed !== null) {
                setLastParsedMessage(parsed)
                setParsedMessages((prev) => {
                    const next = [...prev, parsed]
                    if (options.maxMessages > 0 && next.length > options.maxMessages) next.shift()
                    return next
                })
            }
        }

        // Cập nhật trạng thái lỗi khi có lỗi WebSocket
        ws.onerror = (ev: Event) => {
            debugLog('WS error', ev)
            setError(ev)
        }

        // Cập nhật trạng thái kết nối là CLOSED và cố gắng kết nối lại nếu không phải đóng thủ công
        ws.onclose = (ev) => {
            debugLog('WS close', ev.code, ev.reason)
            setReadyState(WebSocket.CLOSED)
            clearTimers()
            if (!manuallyClosedRef.current) scheduleReconnect()
        }
    }, [
        socketUrl,
        options.protocols,
        options.maxMessages,
        options.parse,
        debugLog,
        startHeartbeat,
        flushQueue,
        scheduleReconnect,
        clearTimers,
    ])

    const disconnectTimerRef = useRef<number | null>(null)
    // Auto-connect on URL change
    useEffect(() => {
        if (!socketUrl) return
        if (disconnectTimerRef.current) {
            window.clearTimeout(disconnectTimerRef.current)
            disconnectTimerRef.current = null
        }
        connect()
        return () => {
            // clean previous socket on URL change/unmount
            // disconnect(1000, 'URL changed/unmount')
            disconnectTimerRef.current = window.setTimeout(() => {
                disconnect(1000, 'URL changed/unmount')
                disconnectTimerRef.current = null
            }, 250)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketUrl]) // intentionally only depends on URL

    // Gửi dữ liệu qua WebSocket nếu nó đang mở, nếu không thì thêm tin nhắn vào hàng đợi
    const send = useCallback<UseWebSocketReturn<TParsed>['send']>((data) => {
        const ws = wsRef.current
        if (!ws) {
            queueRef.current.push(data)
            return false
        }
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(data)
                return true
            } catch {
                return false
            }
        }
        // Not open: enqueue
        queueRef.current.push(data)
        return false
    }, [])

    // Hàm tiện ích để gửi đối tượng JSON đã chuỗi hóa qua WebSocket
    const sendJSON = useCallback<UseWebSocketReturn<TParsed>['sendJSON']>(
        (obj) => {
            try {
                return send(JSON.stringify(obj))
            } catch {
                return false
            }
        },
        [send]
    )

    // Xóa tất cả các tin nhắn đã lưu trữ (cả thô và đã phân tích)
    const clearMessages = useCallback(() => {
        setMessages([])
        setParsedMessages([])
        setLastMessage(null)
        setLastParsedMessage(null)
    }, [])

    const isConnected = readyState === WebSocket.OPEN

    return {
        wsRef,
        messages,
        parsedMessages,
        lastMessage,
        lastParsedMessage,
        readyState,
        isConnected,
        error,
        retries,
        send,
        sendJSON,
        clearMessages,
        connect,
        disconnect,
    }
}
