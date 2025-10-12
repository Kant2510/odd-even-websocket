import { useState, useEffect } from 'react'
import type { GameHistory } from '../types/history'

const DEFAULT_HISTORY: GameHistory = {
    matches: [],
    streak: 0,
    streakOwner: null,
}

const LS_KEY = 'ttt:history:v1'

// ====== HOOK ======
export function useHistory() {
    const [data, setData] = useState<GameHistory>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY)
            return raw ? (JSON.parse(raw) as GameHistory) : DEFAULT_HISTORY
        } catch {
            return DEFAULT_HISTORY
        }
    })

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(data))
    }, [data])

    // ---- Helpers ----
    function recordHistory(winner: string) {
        setData((prev) => {
            const lastId = prev.matches.length > 0 ? prev.matches[prev.matches.length - 1].id : 0
            const newMatches = [...prev.matches, { id: lastId + 1, winner }]
            let newStreak = prev.streak
            let newOwner = prev.streakOwner

            if (winner === 'draw') {
                newStreak = 0
                newOwner = null
            } else {
                const owner = winner
                if (owner === newOwner) newStreak++
                else {
                    newStreak = 1
                    newOwner = owner
                }
            }

            return {
                ...prev,
                matches: newMatches,
                streak: newStreak,
                streakOwner: newOwner,
            }
        })
    }

    function resetAll() {
        setData(DEFAULT_HISTORY)
        localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_HISTORY))
    }

    return {
        history: data,
        recordHistory,
        resetAll,
    }
}
