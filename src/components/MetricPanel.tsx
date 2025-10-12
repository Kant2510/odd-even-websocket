import Badge from './Badge'

// MetricsPanel.tsx
const MetricsPanel = ({ positions, ms }: { positions: number; ms: number }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 100,
                left: 40,
                width: 450,
                paddingTop: 10,
                display: 'flex',
                gap: '20px',
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                justifyContent: 'center',
                marginTop: '20px',
            }}
            // className='p-3 rounded-xl border flex gap-4'
        >
            <h2>AI (Hard) Metrics</h2>
            <Badge label='Positions evaluated' value={positions} color='#0ea5e9' />
            <Badge label='AI thinking (ms)' value={ms} color='#f59e0b' />
        </div>
    )
}

export default MetricsPanel
