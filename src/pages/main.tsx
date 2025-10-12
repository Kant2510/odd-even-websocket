import { Row, Col } from 'antd'
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

            {/* Responsive area: orientation controls the order */}
            <Row className='responsive-grid' gutter={[16, 16]} wrap justify='center' align='top'>
                {/* AI Metrics */}
                <Col className='block block-metrics' xs={24} sm={24} md={8} lg={6} xl={6}>
                    <MetricsPanel positions={metrics.positionsEvaluated} ms={metrics.thinkingMs} />
                </Col>

                {/* Board */}
                <Col className='block block-board board-col' xs={24} sm={24} md={8} lg={12} xl={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Board squares={squares} updateSquares={updateSquares} />
                        <div className={`turn ${turn === 'x' ? 'left' : 'right'}`} style={{ marginTop: 12 }}>
                            <Square clsName='x' />
                            <Square clsName='o' />
                        </div>
                    </div>
                </Col>

                {/* Game History */}
                <Col className='block block-history' xs={24} sm={24} md={8} lg={6} xl={6}>
                    <HistoryPanel history={history} resetHistory={resetHistory} />
                </Col>
            </Row>

            <ResultAnimation winner={winner} resetGame={resetGame} />
            {/* Orientation-aware ordering */}
            <style>{`
                .responsive-grid {
                    /* Row is already a flex container internally,
             but these class orders apply to the Cols */
                }

                /* Default safe sizing */
                .block {
                    min-width: 280px;
                }
                .board-col {
                    /* Give the board a bit more visual weight when wrapping */
                    flex: 1 1 420px;
                }

                /* Portrait: stack vertically
           Order: Board (1) → Metrics (2) → History (3) */
                @media (orientation: portrait) {
                    .block-board {
                        order: 1;
                    }
                    .block-metrics {
                        order: 2;
                    }
                    .block-history {
                        order: 3;
                    }
                }

                /* Landscape: arrange horizontally
           Order: Metrics (1) → Board (2) → History (3) */
                @media (orientation: landscape) {
                    .block-metrics {
                        order: 1;
                    }
                    .block-board {
                        order: 2;
                    }
                    .block-history {
                        order: 3;
                    }
                }
            `}</style>
        </div>
    )
}

export default GameScreen
