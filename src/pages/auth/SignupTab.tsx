import {
  Button,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Divider,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import authService from "../../services/authService";
import { useQuery } from "@tanstack/react-query";
import rankService from "../../services/rankService";
import type { Rank } from "../../@types/Rank";

export default function SignupTab() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  const { data: ranks } = useQuery({
    queryKey: ["ranks"],
    queryFn: async () => await rankService.getAll(),
    initialData: [],
  });
  const handleRequestOtp = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) return message.warning("Please enter your email first");

      setLoading(true);
      // Logic: Backend generates 6-digit code, saves to OtpVerifications, sends email
       await authService.sendOtp(email);
      message.success("OTP sent to your email!");
      setIsOtpSent(true);
    } catch (error: any) {
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishSignup = async (values: any) => {
    try {
      setLoading(true);
      await authService.signup(values);
      message.success("Account created successfully!");
      form.resetFields();
      setIsOtpSent(false);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Form
        form={form}
        onFinish={onFinishSignup}
        layout="vertical"
        size="large"
        className="w-full"
      >
        {/* Personnel Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="serialNumber"
            label="Serial Number"
            rules={[{ required: true }]}
          >
            <Input placeholder="O-123456" />
          </Form.Item>

          <Form.Item name="rankId" label="Rank" rules={[{ required: true }]}>
            <Select
              placeholder="Select Rank"
              onChange={(value) => {
                // Find the full rank object from your array using the selected ID
                const selected = ranks?.find((r) => r.rankId === value) ?? null;
                setSelectedRank(selected);
              }}
            >
              {ranks?.map((r) => (
                <Select.Option value={r.rankId}>{r.rankCode}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Name Section - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input
              style={{ textTransform: selectedRank?.rankCategory?.casing }}
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name">
            <Input
              style={{ textTransform: selectedRank?.rankCategory?.casing }}
              placeholder="Middle Name"
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input
              style={{ textTransform: selectedRank?.rankCategory?.casing }}
              placeholder="Last Name"
            />
          </Form.Item>
        </div>

        {/* Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item name="dateEnlisted" label="Date Enlisted">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="dateEnteredService" label="Date Entered Service">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        {/* Contact & OTP Section */}
        <div className="grid grid-cols-1  gap-x-4 items-end">
          <div className="md:col-span-3">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                addonAfter={
                  <Button
                    type="link"
                    size="small"
                    className="h-auto p-0"
                    onClick={handleRequestOtp}
                    disabled={isOtpSent || loading}
                  >
                    {isOtpSent ? "Resend?" : "Send OTP"}
                  </Button>
                }
              />
            </Form.Item>
          </div>

          <div className="md:col-span-1">
            <Form.Item
              name="otpCode"
              label="OTP"
              rules={[{ required: true, message: "Enter Code" }]}
              hidden={!isOtpSent}
            >
              <Input.OTP length={6} />
            </Form.Item>
          </div>
        </div>

        <Divider />

        {/* Password Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
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
        </div>

        <Form.Item className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-12 bg-blue-600 hover:bg-blue-700 rounded-md"
            disabled={!isOtpSent}
          >
            Create Personnel Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
