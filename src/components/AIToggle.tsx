import { useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Flex, Radio, Switch } from 'antd'

interface AIToggleProps {
    toggleCallback: () => void
    changeDifficulty: (difficultyLevel: string) => void
    isAiMode: boolean
}

const AIToggle: React.FC<AIToggleProps> = ({ toggleCallback, changeDifficulty, isAiMode }) => {
    const [value, setValue] = useState(1)
    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value)
        changeDifficulty(e.target.value === 1 ? 'easy' : 'hard')
    }

    return (
        <div
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                color: '#eee',
                marginBottom: '10px',
            }}
        >
            <Flex gap='small' justify='center' align='center' style={{ color: '#eee' }}>
                <Switch onChange={toggleCallback} />
                AI Mode
            </Flex>

            <Radio.Group
                onChange={onChange}
                value={value}
                options={[
                    {
                        value: 1,
                        className: 'option-1',
                        label: (
                            <Flex gap='small' justify='center' align='center' style={{ color: '#eee' }}>
                                Easy
                            </Flex>
                        ),
                        disabled: !isAiMode,
                    },
                    {
                        value: 2,
                        className: 'option-2',
                        label: (
                            <Flex gap='small' justify='center' align='center' style={{ color: '#eee' }}>
                                Hard
                            </Flex>
                        ),
                        disabled: !isAiMode,
                    },
                ]}
            />
        </div>
    )
}

export default AIToggle
