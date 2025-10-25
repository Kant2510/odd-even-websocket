import { useNavigate } from 'react-router'
import { Button, Input, Form } from 'antd'
import type { FormProps } from 'antd'
import { isValidRoomId } from '../utils/common'

type FieldType = {
    roomId: string
}

const Home = () => {
    const navigate = useNavigate()

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (!isValidRoomId(values.roomId)) {
            console.log('Invalid room ID:', values.roomId)
            return
        }
        console.log('Success:', values)
        navigate(`/game?room_id=${encodeURIComponent(values.roomId)}`)
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <div>
            <h1>Welcome to the Odd Even Game</h1>
            <div
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Form
                    name='basic'
                    layout='inline'
                    style={{ maxWidth: 400 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                >
                    <Form.Item<FieldType>
                        name='roomId'
                        rules={[{ required: true, message: 'Please input your room ID!' }]}
                    >
                        <Input placeholder='Enter Room ID' />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
export default Home
