import { useCallback, useState } from 'react'
import { useHistory } from './useHistory'

const useTicTacToe = () => {
    const [squares, setSquares] = useState<number[]>(Array(25).fill(0))
    const [winner, setWinner] = useState<string | null>(null)
    const { history, resetAll } = useHistory()

    const updateFullSquares = useCallback(
        (newSquares: number[]) => {
            setSquares((prev) => {
                if (winner) return prev
                return newSquares
            })
        },
        [winner]
    )

    const updateSquares = useCallback(
        (ind: number, value: number) => {
            setSquares((prev) => {
                // Nếu đã có winner hoặc ô không thay đổi => bỏ qua
                if (winner || prev[ind] === value) return prev

                // Clone bất biến
                const next = [...prev]
                next[ind] = value

                return next
            })
        },
        [winner]
    )

    const updateWinner = useCallback((winner: string | null) => {
        setWinner(winner)
    }, [])

    const resetGame = () => {
        setSquares(Array(25).fill(0))
        setWinner(null)
    }

    return {
        squares,
        winner,
        history,
        updateFullSquares,
        updateSquares,
        updateWinner,
        resetGame,
        resetHistory: resetAll,
    }
}

export default useTicTacToe
