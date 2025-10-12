const Badge = ({ label, value, color }: { label: string; value: number | string; color: string }) => {
    return (
        <div
            style={{
                background: `${color}22`,
                border: `1px solid ${color}55`,
                padding: '6px 12px',
                borderRadius: '8px',
            }}
            // className='px-3 py-1 rounded-lg'
        >
            <div
                style={{
                    color,
                    fontSize: '0.8em',
                }}
                // className='text-xs'
            >
                {label}
            </div>
            <div
                style={{ color, fontWeight: '600', fontSize: '1.2em' }}
                // className='text-lg font-semibold'
            >
                {value}
            </div>
        </div>
    )
}

export default Badge
