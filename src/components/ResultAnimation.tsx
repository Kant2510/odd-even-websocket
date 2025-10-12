import { AnimatePresence, motion } from 'framer-motion'
import Square from './Square'
import Button from './Button'

interface ResultAnimationProps {
    winner: string | null
    resetGame: () => void
}

const ResultAnimation = ({ winner, resetGame }: ResultAnimationProps) => {
    return (
        <AnimatePresence>
            {winner && (
                <motion.div
                    key={'parent-box'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='winner'
                    style={{
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                        top: 0,
                        left: 0,
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: '#3ac076d3',
                    }}
                >
                    <motion.div
                        key={'child-box'}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                        }}
                        style={{
                            background: '#226022',
                            width: '70%',
                            maxWidth: '400px',
                            height: '300px',
                            border: '2px solid #eee',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '20px',
                        }}
                    >
                        <motion.h2
                            initial={{
                                scale: 0,
                                y: 100,
                            }}
                            animate={{
                                scale: 1,
                                y: 0,
                                transition: {
                                    y: {
                                        delay: 0.7,
                                    },
                                    duration: 0.7,
                                },
                            }}
                            style={{
                                fontSize: '2.5em',
                                margin: '15px 0',
                                color: '#eee',
                            }}
                        >
                            {winner === 'draw' ? 'Tie!!' : 'Winner!!'}
                        </motion.h2>
                        <motion.div
                            initial={{
                                scale: 0,
                            }}
                            animate={{
                                scale: 1,
                                transition: {
                                    delay: 1.3,
                                    duration: 0.2,
                                },
                            }}
                            style={{
                                margin: '0 auto',
                                width: 'fit-content',
                                border: '2px solid #eee',
                                borderRadius: '10px',
                                display: 'flex',
                                gap: '15px',
                            }}
                        >
                            {winner === 'draw' ? (
                                <>
                                    <Square clsName='x' />
                                    <Square clsName='o' />
                                </>
                            ) : (
                                <>
                                    <Square clsName={winner} />
                                </>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{
                                scale: 0,
                            }}
                            animate={{
                                scale: 1,
                                transition: {
                                    delay: 1.5,
                                    duration: 0.3,
                                },
                            }}
                        >
                            <Button resetGame={resetGame} text='Play Again' />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ResultAnimation
