import { useState, useEffect } from 'react'
import { checkWinner, checkEndTheGame } from '../game/utils'
import { findBestMove } from '../game/core'
import { useHistory } from './useHistory'
import { DEFAULT_METRICS, type Metrics } from '../types/metric'

export const useTicTacToe = () => {
    const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
    const [turn, setTurn] = useState<string>('x')
    const [winner, setWinner] = useState<string | null>(null)
    const [isAiMode, setIsAiMode] = useState<boolean>(false)
    const [difficulty, setDifficulty] = useState<string>('easy')
    const { history, recordHistory, resetAll } = useHistory()
    const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS)

    const updateSquares = (ind: string) => {
        if (squares[Number(ind)] || winner || (isAiMode && turn === 'o')) {
            return
        }
        const s = [...squares]
        s[Number(ind)] = turn
        setSquares(s)
        setTurn(turn === 'x' ? 'o' : 'x')
        const W = checkWinner(s)
        if (W) {
            setWinner(W)
            recordHistory(W)
        } else if (checkEndTheGame(s)) {
            setWinner('draw')
            recordHistory('draw')
        }
    }

    // AI move logic
    useEffect(() => {
        if (isAiMode && turn === 'o' && !winner) {
            let positions = 0
            const countEval = () => {
                positions++
            }

            const t0 = performance.now()
            const bestMove = findBestMove([...squares], difficulty, countEval)
            const t1 = performance.now()

            if (bestMove !== -1) {
                setMetrics({ positionsEvaluated: positions, thinkingMs: Math.round((t1 - t0) * 1000) / 1000 })
                const s = [...squares]
                s[bestMove] = 'o'
                setSquares(s)
                setTurn('x')
                const W = checkWinner(s)
                if (W) {
                    setWinner(W)
                    recordHistory(W)
                } else if (checkEndTheGame(s)) {
                    setWinner('draw')
                    recordHistory('draw')
                }
            }
        }
    }, [turn, isAiMode, winner, difficulty, squares, recordHistory])

    const resetGame = () => {
        setSquares(Array(9).fill(''))
        setTurn('x')
        setWinner(null)
        setMetrics(DEFAULT_METRICS)
    }

    const toggleAiMode = () => {
        setIsAiMode(!isAiMode)
        resetGame()
    }

    const changeDifficulty = (difficultyLevel: string) => {
        // const difficulties = ['easy', 'medium', 'hard']
        // const currentIndex = difficulties.indexOf(difficulty)
        // const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length]
        setDifficulty(difficultyLevel)
        resetGame()
    }

    return {
        squares,
        turn,
        winner,
        isAiMode,
        difficulty,
        history,
        metrics,
        updateSquares,
        resetGame,
        toggleAiMode,
        changeDifficulty,
        resetHistory: resetAll,
    }
}
