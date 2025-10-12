import { useMemo } from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import type { GameHistory, Match } from '../types/history'
import { DeleteOutlined, FireOutlined } from '@ant-design/icons'

interface RecordType {
    id: number
    x: React.ReactNode
    o: React.ReactNode
}

const columns: TableProps<RecordType>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Player X',
        dataIndex: 'x',
    },
    {
        title: 'Player O',
        dataIndex: 'o',
    },
]

const ResultSpan = (result: string) => {
    if (result === 'x') return <span style={{ color: 'green' }}>Win</span>
    if (result === 'o') return <span style={{ color: 'red' }}>Lose</span>
    return <span style={{ color: 'gray' }}>Draw</span>
}

const getData = (matches: Match[]) => {
    if (!matches) return []
    return matches.map<RecordType>((match, index) => ({
        id: index,
        x: ResultSpan(match.winner === 'x' ? 'x' : match.winner === 'o' ? 'o' : 'draw'),
        o: ResultSpan(match.winner === 'o' ? 'x' : match.winner === 'x' ? 'o' : 'draw'),
    }))
}

interface HistoryListProps {
    history: GameHistory
    resetHistory: () => void
}

const HistoryPanel = ({ history, resetHistory }: HistoryListProps) => {
    const historyData = useMemo<RecordType[]>(() => getData(history.matches), [history.matches])

    return (
        <div
            style={{
                position: 'absolute',
                top: 100,
                right: 40,
                width: 400,
                borderRadius: 10,
                border: '1px solid #ccc',
                paddingTop: 10,
            }}
        >
            <h2>Game History</h2>
            <h3 style={{ color: 'orange' }}>
                <FireOutlined /> {history.streakOwner ? `Player ${history.streakOwner.toUpperCase()}` : 'No one'}'s
                Streak: {history.streak}
            </h3>
            <div style={{ padding: '10px 20px 10px' }}>
                <Table<RecordType>
                    bordered={true}
                    columns={columns}
                    scroll={{ x: 0, y: 400 }}
                    rowKey='id'
                    dataSource={historyData}
                    pagination={false}
                />
            </div>
            <div
                style={{
                    textAlign: 'right',
                    padding: '0 20px 10px',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    color: '#eee',
                }}
            >
                <DeleteOutlined onClick={resetHistory} />
            </div>
        </div>
    )
}

export default HistoryPanel
