import { useState } from 'react'

const Button: React.FC<{ resetGame: () => void; text: string }> = ({ resetGame, text }) => {
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    const styles = {
        padding: '8px 12px',
        margin: '25px',
        background: isHovered ? '#eee' : 'transparent',
        border: '2px solid #eee',
        color: isHovered ? '#222' : '#eee',
        width: '120px',
        borderRadius: '5px',
        transition: '0.2s',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
    return (
        <button
            className='cus-btn'
            style={styles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => resetGame()}
        >
            {text}
        </button>
    )
}

export default Button
