import { motion } from 'framer-motion'
import './Square.scss'

interface SquareProps {
    index?: number
    value: number
    // updateSquares?: (ind: number) => void
    handleMove?: (ind: number) => void
}

const Square: React.FC<SquareProps> = ({ index, value, handleMove }) => {
    const handleClick = () => {
        // updateSquares?.(index!)
        handleMove?.(index!)
    }

    const value2label = (val: number) => {
        switch (val) {
            case 0:
                return ''
            case -1:
                return 'ODD'
            case -2:
                return 'EVEN'
            default:
                return val
        }
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='square'
            onClick={handleClick}
            style={{ color: value % 2 === 0 ? '#4ea1ff' : '#ffa02e' }}
        >
            {value2label(value)}
        </motion.div>
    )
}

export default Square
