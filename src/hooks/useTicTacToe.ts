import { useState, useEffect } from 'react'
import { checkWinner, checkEndTheGame } from '../utils/gameLogic'
import { findBestMove } from '../utils/aiLogic'

export const useTicTacToe = () => {
    const [squares, setSquares] = useState<string[]>(Array(9).fill(''))
    const [turn, setTurn] = useState<string>('x')
    const [winner, setWinner] = useState<string | null>(null)
    const [isAiMode, setIsAiMode] = useState<boolean>(false)
    const [difficulty, setDifficulty] = useState<string>('easy')

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
        } else if (checkEndTheGame(s)) {
            setWinner('x | o')
        }
    }

    // AI move logic
    useEffect(() => {
        if (isAiMode && turn === 'o' && !winner) {
            const bestMove = findBestMove([...squares], difficulty)
            if (bestMove !== -1) {
                const s = [...squares]
                s[bestMove] = 'o'
                setSquares(s)
                setTurn('x')
                const W = checkWinner(s)
                if (W) {
                    setWinner(W)
                } else if (checkEndTheGame(s)) {
                    setWinner('x | o')
                }
            }
        }
    }, [turn, isAiMode, winner, difficulty])

    const resetGame = () => {
        setSquares(Array(9).fill(''))
        setTurn('x')
        setWinner(null)
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
        updateSquares,
        resetGame,
        toggleAiMode,
        changeDifficulty,
    }
}
