export type ReadyState = WebSocket['readyState'] // 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED

export type UseWebSocketOptions<TParsed = unknown> = {
    // Reconnect
    shouldReconnect?: boolean
    maxRetries?: number
    backoffBaseMs?: number //  e.g. 500
    backoffMaxMs?: number //  e.g. 10_000
    // Heartbeat
    heartbeatEnabled?: boolean
    heartbeatIntervalMs?: number //  e.g. 25_000
    heartbeatMessage?: string | (() => string) // default: 'PING'
    // Messages buffer
    maxMessages?: number // 0 = unlimited
    // Parsing
    parse?: (raw: string) => TParsed | null // default: JSON.parse with guard
    // Open-time headers / protocols (browser WS only supports subprotocols)
    protocols?: string | string[]
    // Debug
    debug?: boolean
}

export interface UseWebSocketReturn<TParsed = unknown> {
    wsRef: React.RefObject<WebSocket | null>
    messages: string[]
    parsedMessages: TParsed[]
    lastMessage: string | null
    lastParsedMessage: TParsed | null
    readyState: ReadyState
    isConnected: boolean
    error: Event | null
    retries: number
    send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean
    sendJSON: (obj: unknown) => boolean
    clearMessages: () => void
    connect: () => void
    disconnect: (code?: number, reason?: string) => void
}
