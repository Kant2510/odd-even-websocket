export const GAME_TITLE = 'Even Odd Game'

export const SIZE = 5

export const TOTAL_CELLS = SIZE * SIZE

export const BOARD_INDICES = Array.from({ length: TOTAL_CELLS }, (_, i) => i)

export const SOCKET_URL = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'ws://localhost:4000'
