const StatusDot: React.FC<{ status: 'online' | 'offline' | 'busy' }> = ({ status }) => {
    const getColor = () => {
        switch (status) {
            case 'online':
                return '#4dff8a'
            case 'offline':
                return 'red'
            case 'busy':
                return 'yellow'
            default:
                return 'gray'
        }
    }

    return (
        <span
            style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getColor(),
            }}
        />
    )
}
export default StatusDot
