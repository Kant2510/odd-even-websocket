import { BOARD_INDICES, SIZE } from '../constants/common'
import Square from './Square'

interface BoardProps {
    squares: number[]
    // updateSquares: (ind: number) => void
    handleMove?: (ind: number) => void
}

const Board = ({ squares, handleMove }: BoardProps) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
                gap: '5px',
                width: 'fit-content',
            }}
        >
            {BOARD_INDICES.map((ind: number) => (
                <Square
                    key={ind}
                    index={ind}
                    value={squares[ind]}
                    // updateSquares={updateSquares}
                    handleMove={handleMove}
                />
            ))}
        </div>
    )
}

export default Board
