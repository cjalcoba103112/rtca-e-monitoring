import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Spin } from 'antd';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import authService from '../../services/authService';
import InvalidTokenResponse from './InvalidTokenResponse';
import type { Usertbl } from '../../@types/Usertbl';
import userService from '../../services/userService';
import { useAuth } from '../../context/UserContext';

const { Title, Text } = Typography;

const ChangeDefaultPassword: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, _] = useState(false);
    const [isValid, setIsValid] = useState<boolean>(false);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const { token = "" } = useParams<{ token: string }>();

    const { data: user, isFetching } = useQuery({
        queryKey: [token],
        queryFn: async () => {
            try {
                const user = await authService.getbyChangePasswordToken(token);

                setIsValid(!!user);
                return user;

            }
            catch {
                setIsValid(false)
            }
        }
    })

    const onFinish = async (values: Usertbl) => {
        try {
            const updatedUser = await userService.changeDefaultPassword({
                ...user,
                password: values.password
            });

            setUser(updatedUser);
            navigate(updatedUser.role?.indexPath ?? "/")
        }
        catch {

        }

    };

    if (isFetching) return <Spin />

    if (!isValid && !isFetching) return <InvalidTokenResponse />


    return (
        <div className='md:p-20' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f7f6',

        }}>
            <Card
                style={{ maxWidth: 700, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: '40px 30px' }}
            >

                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                        background: '#e6f7ff',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 15
                    }}>
                        <KeyOutlined style={{ fontSize: 28, color: '#1677ff' }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>Update Default Password</Title>
                    <Text type="secondary">You are using a default password. Please set a new secure password to continue.</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value)
                                        return Promise.resolve();
                                    return Promise.reject(new Error("Mismatch!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 35, marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                            style={{ height: 48, borderRadius: 8, fontWeight: 600 }}
                        >
                            Update & Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangeDefaultPassword;