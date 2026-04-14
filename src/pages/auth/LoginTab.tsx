import { Button, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import authService from "../../services/authService";
import type { Login } from "../../@types/nonTable/Login";
import { useAuth } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginTab() {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const {setUser} = useAuth();
  const navigate = useNavigate();
  const onFinishLogin = async (values: Login) => {
    try {
      setLoading(true);
      const data =await authService.login(values);
      setUser(data);
      navigate("/");
      form.resetFields(); 
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to sign up. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Form<Login>
        form={form}
        name="login"
        onFinish={onFinishLogin}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="userName"
          label="Username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Username"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password required" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            className="rounded-lg"
          />
        </Form.Item>

        <div className="flex justify-end mb-4">
          <Button type="link" className="p-0 text-blue-600">
            Forgot Password?
          </Button>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
