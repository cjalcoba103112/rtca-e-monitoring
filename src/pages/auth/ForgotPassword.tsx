import { Modal, Form, Input, Button, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import userService from "../../services/userService";

const { Title, Text } = Typography;

// Define the interface props so the parent component can control visibility
interface ForgotPasswordProps {
    open: boolean;
    onClose: () => void;
}

interface ForgotPasswordValues {
    email: string;
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const onFinishForgotPassword = async (values: ForgotPasswordValues) => {
        try {
            setLoading(true);

            await userService.forgotPassword(values.email);


            message.success("If the email matches an active account, a password reset link has been sent!");
            handleCancel();
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || "Failed to submit recovery request.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!loading) {
            form.resetFields();
            onClose();
        }
    };

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }} className="text-slate-800">
                    Forgot Password?
                </Title>
            }
            open={open}
            onCancel={handleCancel}
            footer={null} // Handled dynamically inside the form container
            centered
            destroyOnClose
            width={420}
        >
            <p className="text-gray-500 my-4 text-sm leading-relaxed">
                Enter your registered email address below, and we will send you an automated link to securely reset your credentials.
            </p>

            <Form<ForgotPasswordValues>
                form={form}
                layout="vertical"
                size="large"
                onFinish={onFinishForgotPassword}
                requiredMark={false}
            >
                <Form.Item
                    name="email"
                    label={
                        <Text strong className="text-gray-600 text-xs uppercase tracking-wider">
                            Account Email Address
                        </Text>
                    }
                    rules={[
                        { required: true, message: "Please enter your email address" },
                        { type: "email", message: "Please enter a valid email address" }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="text-gray-400 mr-1" />}
                        placeholder="e.g. personnel@company.com"
                        disabled={loading}
                        className="rounded-lg h-11"
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        disabled={loading}
                        onClick={handleCancel}
                        className="rounded-lg px-4 h-11 border-gray-300 text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg px-5 h-11 font-medium border-none"
                    >
                        Send Reset Link
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}