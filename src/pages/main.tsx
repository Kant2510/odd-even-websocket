import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Row, Col, Button as LibButton } from 'antd'
import ResultAnimation from '../components/ResultAnimation'
import Board from '../components/Board'
import useWebSocket from '../hooks/socket'
import useTicTacToe from '../hooks/useTicTacToe'
import { isValidRoomId } from '../utils/common'
import { GAME_TITLE, SOCKET_URL } from '../constants/common'
import StatusDot from '../components/StatusDot'

interface ServerMsg {
    event: string
    sender: string | null
    payload: any
}

function GameScreen() {
    const { squares, winner, updateFullSquares, updateSquares, updateWinner } = useTicTacToe()
    const navigate = useNavigate()
    const router = useLocation()
    const queryParams = new URLSearchParams(router.search)
    const roomId = queryParams.get('room_id') || ''
    const [playerId, setPlayerId] = useState<string | null>(null)
    const [isReady, setIsReady] = useState<{ [id: string]: boolean }>({ odd: false, even: false })
    const [isJoined, setIsJoined] = useState<{ [id: string]: boolean }>({ odd: false, even: false })
    const [isStarted, setIsStarted] = useState<boolean>(false)
    const [notification, setNotification] = useState<string>('')
    const hasJoinedRef = useRef(false)
    const wsUrl = SOCKET_URL
    const { lastParsedMessage, isConnected, retries, error, sendJSON, disconnect } = useWebSocket<ServerMsg>(wsUrl, {
        shouldReconnect: true,
        maxRetries: 8,
        heartbeatEnabled: false,
        maxMessages: 200,
        parse: (raw) => {
            try {
                return JSON.parse(raw) as ServerMsg
            } catch {
                return null
            }
        },
        debug: process.env.NODE_ENV !== 'production',
    })

    // Guard roomId
    useEffect(() => {
        if (!roomId || typeof roomId !== 'string' || !isValidRoomId(roomId)) {
            navigate('/?reason=invalid_room')
        }
    }, [roomId, navigate])

    // Xử lý message từ server
    const handleServerMessage = useCallback((msg: ServerMsg) => {
        const { event, sender, payload } = msg

        switch (event) {
            case 'JOINED':
                console.log('Get msg from joined:', msg)
                setPlayerId(sender)
                setIsJoined({
                    odd: payload.joinedStatus['odd'] || false,
                    even: payload.joinedStatus['even'] || false,
                })
                setIsReady({
                    odd: payload.readiedStatus['odd'] || false,
                    even: payload.readiedStatus['even'] || false,
                })
                updateFullSquares(payload.gameState as number[])
                updateWinner(payload.winner) // 'odd' | 'even' | 'draw' | null
                setNotification(`Joined room as Player ${sender} \n Waiting for opponent...`)
                break
            case 'READIED':
                console.log('Get msg from readied:', msg)
                setIsReady({
                    odd: payload.readiedStatus['odd'] || false,
                    even: payload.readiedStatus['even'] || false,
                })
                // setNotification(`Player ${sender} is ready.`)
                break
            case 'START':
                console.log('Get msg from start:', msg)
                // if game started, it means both players have ready
                setIsReady({
                    odd: true,
                    even: true,
                })
                setIsStarted(true)
                setNotification('Game started!')
                updateFullSquares(payload.gameState as number[])
                break
            case 'FULL':
                console.error('Room is full:', msg)
                navigate(`/?reason=room_full`)
                break
            case 'ERROR':
                console.error('Server error:', msg)
                disconnect()
                navigate(`/?reason=server_error`)
                break
            case 'STATE_SYNC':
                console.log('Get msg from state sync:', msg)
                updateSquares(payload.square, payload.value)
                break
            case 'PLAYER_JOINED':
                console.log('Get msg from player joined:', msg)
                if (sender) setIsJoined((prev) => ({ ...prev, [sender]: true }))
                setNotification('Opponent joined! Click "Ready" when you are ready.')
                break
            case 'PLAYER_READIED':
                console.log('Get msg from player ready:', msg)
                if (sender) setIsReady((prev) => ({ ...prev, [sender]: true }))
                setNotification(`Player ${sender} is ready.`)
                break
            case 'PLAYER_LEFT_THE_GAME':
                console.log('Get msg from player left the game:', msg)
                if (sender) {
                    setIsJoined((prev) => ({ ...prev, [sender]: false }))
                }
                setIsReady({
                    odd: payload.readiedStatus['odd'] || false,
                    even: payload.readiedStatus['even'] || false,
                })
                setIsStarted(false)
                setNotification('Opponent left the game. Waiting for new opponent...')
                break
            case 'PLAYER_LEFT_THE_ROOM':
                console.log('Get msg from player left the room:', msg)
                if (sender) {
                    setIsJoined((prev) => ({ ...prev, [sender]: false }))
                    setIsReady((prev) => ({ ...prev, [sender]: false }))
                }
                setNotification('Opponent left the room. Waiting for new opponent...')
                break
            case 'GAMEOVER':
                console.log('Get msg from gameover:', msg)
                setIsReady({
                    odd: payload.readiedStatus['odd'] || false,
                    even: payload.readiedStatus['even'] || false,
                })
                setIsStarted(false)
                updateWinner(payload.winner) // 'odd' | 'even' | 'draw'
                setNotification('Game over!')
                break
            case 'RESET':
                console.log('Get msg from reset:', msg)
                setIsStarted(false)
                updateWinner(null)
                setNotification('Game has been reset. Click "Ready" when you are ready.')
                break
            case 'RESET_BOARD':
                console.log('Get msg from reset board:', msg)
                updateFullSquares(payload.gameState as number[])
                break
            default:
                // unknown type => ignore
                break
        }
    }, [])

    useEffect(() => {
        if (lastParsedMessage) handleServerMessage(lastParsedMessage)
    }, [lastParsedMessage, handleServerMessage])

    useEffect(() => {
        if (hasJoinedRef.current) return
        hasJoinedRef.current = true

        console.log('Joining room:', roomId)
        sendJSON({
            event: 'join',
            roomId,
            sender: null,
            payload: {},
        })
    }, [roomId])

    const handleMove = useCallback(
        (ind: number) => {
            if (!isReady) return // Chưa sẵn sàng thì không cho đánh
            if (playerId === null) return // Chưa biết mình là player nào
            if (!isStarted) return // Chưa bắt đầu game

            sendJSON({
                payload: {
                    square: ind,
                },
                roomId,
                sender: playerId,
                event: 'move',
            })
        },
        [isReady, playerId, isStarted, roomId, sendJSON]
    )

    const handleReady = () => {
        sendJSON({
            event: 'ready',
            sender: playerId,
            roomId,
            payload: {},
        })
    }

    const handleLeave = () => {
        sendJSON({
            event: 'ready',
            sender: playerId,
            roomId,
            payload: {},
        })
        sendJSON({
            event: 'leave',
            sender: playerId,
            roomId,
            payload: {},
        })
        console.log('Left the room, navigating back to home')
        navigate('/')
    }

    const handleResetGame = () => {
        sendJSON({
            event: 'reset',
            sender: playerId,
            roomId,
            payload: {},
        })
    }

    const getOpponentId = () => {
        if (!playerId) return null
        return playerId === 'odd' ? 'even' : 'odd'
    }

    // Hiển thị trạng thái kết nối cơ bản ở màn chờ
    const ConnectionInfo = () => (
        <div style={{ margin: 16, color: '#eee', border: '3px solid #eee', padding: 8, borderRadius: 4 }}>
            <div>
                Room: <b>{roomId}</b>
            </div>
            <div>WS: {isConnected ? 'Connected' : 'Connecting…'}</div>
            <div>ReadyState: {isReady ? 'Ready' : 'Not Ready'}</div>
            {retries > 0 && <div>Reconnect attempt: {retries}</div>}
            {error && <div className='text-red-500'>WS error occurred</div>}
        </div>
    )

    return (
        <div
            style={{
                width: 'fit-content',
                margin: '0 auto',
                textAlign: 'center',
            }}
        >
            <h1>{GAME_TITLE}</h1>
            <ConnectionInfo />
            <h2>You are player {playerId}</h2>
            <h2>{notification}</h2>
            <div style={{ padding: '8px 12px', margin: '15px' }}>
                <LibButton style={{ marginLeft: 10 }} onClick={handleReady} disabled={isStarted}>
                    {isReady[playerId || ''] ? 'Unready' : 'Ready'}
                </LibButton>
                <LibButton style={{ marginLeft: 10 }} onClick={handleLeave}>
                    Leave
                </LibButton>
            </div>
            {/* Responsive area: orientation controls the order */}
            <Row className='responsive-grid' gutter={[16, 16]} wrap justify='center' align='top'>
                {/* Board */}
                <Col className='block block-board board-col' xs={24} sm={24} md={8} lg={12} xl={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Board squares={squares} handleMove={handleMove} />
                    </div>
                </Col>
            </Row>
            <table style={{ margin: '20px auto', color: '#fff', width: '200px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Status</th>
                        <th>Ready</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>You</td>
                        <td>
                            {isJoined[playerId || ''] ? <StatusDot status='online' /> : <StatusDot status='offline' />}
                        </td>
                        <td>{isReady[playerId || ''] ? '✅' : '❌'}</td>
                    </tr>
                    <tr>
                        <td>Opponent</td>
                        <td>
                            {isJoined[getOpponentId() || ''] ? (
                                <StatusDot status='online' />
                            ) : (
                                <StatusDot status='offline' />
                            )}
                        </td>
                        <td>{isReady[getOpponentId() || ''] ? '✅' : '❌'}</td>
                    </tr>
                </tbody>
            </table>
            <ResultAnimation winner={winner} resetGame={handleResetGame} />
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
