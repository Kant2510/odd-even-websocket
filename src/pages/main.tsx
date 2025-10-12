import { useTicTacToe } from '../hooks/useTicTacToe'
import Button from '../components/Button'
import Square from '../components/Square'
import AIToggle from '../components/AIToggle'
import ResultAnimation from '../components/ResultAnimation'
import Board from '../components/Board'
import HistoryPanel from '../components/HistoryPanel'
import MetricsPanel from '../components/MetricPanel'

function GameScreen() {
    const {
        turn,
        squares,
        isAiMode,
        difficulty,
        winner,
        history,
        metrics,
        resetGame,
        toggleAiMode,
        changeDifficulty,
        updateSquares,
        resetHistory,
    } = useTicTacToe()

    return (
        <div
            style={{
                width: 'fit-content',
                margin: '40px auto',
                textAlign: 'center',
            }}
        >
            <h1>TIC-TAC-TOE</h1>
            <h2>
                Play{' '}
                {isAiMode
                    ? `against AI (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} mode)`
                    : 'with a friend'}
            </h2>
            <div>
                <Button resetGame={resetGame} text='Reset Game' />
                <AIToggle toggleCallback={toggleAiMode} changeDifficulty={changeDifficulty} isAiMode={isAiMode} />
            </div>
            <Board squares={squares} updateSquares={updateSquares} />
            <div className={`turn ${turn === 'x' ? 'left' : 'right'}`}>
                <Square clsName='x' />
                <Square clsName='o' />
            </div>
            <ResultAnimation winner={winner} resetGame={resetGame} />
            <MetricsPanel positions={metrics.positionsEvaluated} ms={metrics.thinkingMs} />
            <HistoryPanel history={history} resetHistory={resetHistory} />
        </div>
    )
}

export default GameScreen
