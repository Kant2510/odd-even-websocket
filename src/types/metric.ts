export interface Metrics {
    positionsEvaluated: number
    thinkingMs: number
}

export const DEFAULT_METRICS: Metrics = { positionsEvaluated: 0, thinkingMs: 0 }
