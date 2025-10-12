export interface Match {
    id: number
    winner: string
}

export interface GameHistory {
    matches: Match[]
    streak: number
    streakOwner: string | null
}
