import Square from './Square'

interface BoardProps {
    squares: string[]
    updateSquares: (ind: string) => void
}

const Board = ({ squares, updateSquares }: BoardProps) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: 'fit-content',
                margin: '0 auto',
            }}
        >
            {Array.from('012345678').map((ind: string) => (
                <Square key={ind} ind={ind} updateSquares={updateSquares} clsName={squares[Number(ind)]} />
            ))}
        </div>
    )
}

export default Board
