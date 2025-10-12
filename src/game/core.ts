import { checkEndTheGame, checkWinner } from './utils'

type CountFn = () => void

export const minimax = (board: string[], depth: number, isMaximizing: boolean, onEvaluate: CountFn): number => {
    // Mỗi lần vào node (trạng thái) ta coi như 1 evaluation
    onEvaluate()

    const result = checkWinner(board)

    // Scoring with depth consideration
    if (result === 'o') return 10 - depth
    if (result === 'x') return depth - 10
    if (checkEndTheGame(board)) return 0

    if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'o'
                let score = minimax(board, depth + 1, false, onEvaluate)
                board[i] = ''
                bestScore = Math.max(score, bestScore)
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'x'
                let score = minimax(board, depth + 1, true, onEvaluate)
                board[i] = ''
                bestScore = Math.min(score, bestScore)
            }
        }
        return bestScore
    }
}

export const findBestMove = (board: string[], difficulty: string, onEvaluate: CountFn): number => {
    // Easy Mode: Random move
    if (difficulty === 'easy') {
        const emptySquares = board.reduce((acc: number[], sq, idx) => (sq === '' ? [...acc, idx] : acc), [] as number[])
        return emptySquares[Math.floor(Math.random() * emptySquares.length)]
    }

    // Hard Mode: Improved strategic moves
    let bestScore = -Infinity
    let bestMove = -1

    // Prioritize center and corners
    const prioritySquares = [4, 0, 2, 6, 8]

    // First, try to win by completing a row, column, or diagonal
    // If not possible, block the opponent's winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'o'
            onEvaluate()
            const winner = checkWinner(board)
            board[i] = ''
            if (winner === 'o') return i
        }
    }

    // Block player's winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'x'
            onEvaluate()
            const winner = checkWinner(board)
            board[i] = ''
            if (winner === 'x') return i
        }
    }

    // Use Minimax for remaining moves
    let bestPrio = -1
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'o'
            let score = minimax(board, 0, false, onEvaluate)
            board[i] = ''

            // Prefer priority squares if scores are close
            // const priorityBonus = prioritySquares.includes(i) ? 0.5 : 0
            const prio = i === 4 ? 2 : prioritySquares.includes(i) ? 1 : 0

            // if (score + priorityBonus > bestScore) {
            //     bestScore = score
            //     bestMove = i
            // }

            if (score > bestScore || (score === bestScore && prio > bestPrio)) {
                bestScore = score
                bestPrio = prio
                bestMove = i
            }
        }
    }

    return bestMove
}
