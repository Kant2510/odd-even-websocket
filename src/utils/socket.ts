const defaultParse = <T>(raw: string): T | null => {
    try {
        return JSON.parse(raw) as T
    } catch {
        return null
    }
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const jitter = (ms: number) => Math.round(ms * (0.8 + Math.random() * 0.4)) // ±20%

export { defaultParse, clamp, jitter }
