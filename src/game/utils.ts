import { WINNING_COMBOS } from './constant'

export const checkWinner = (board: string[]) => {
    for (let combo of WINNING_COMBOS) {
        const [a, b, c] = combo
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]
        }
    }
    return null
}

export const checkEndTheGame = (board: string[]) => {
    return board.every((square) => square !== '')
}
