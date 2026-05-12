import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form, Input, Button, Card, Typography, Result,
     Space, message, Skeleton, Descriptions, Tag, Alert, Tooltip
} from 'antd';
import {
    SendOutlined,
    RollbackOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { formatDateToMilitary } from '../../utils/formatDateToMilitary';
import { useQuery } from '@tanstack/react-query';
import activityAppealService from '../../services/activityAppealService';
import type { ActivityAppeal } from '../../@types/ActivityAppeal';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ActivityAppealForm: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm<ActivityAppeal>();
    const [submitting, setSubmitting] = useState<boolean>(false);
    // 1. Fetching Data with TanStack Query
    const { data: appealRecord, isLoading, isError } = useQuery({
        queryKey: ["activityAppeal", token],
        queryFn: () => activityAppealService.getByToken(token ?? ""),
        enabled: !!token,
        retry: 1
    });



    const activity = appealRecord?.personnelActivity;

    if (isLoading) return <div className="p-10"><Card className="max-w-2xl mx-auto"><Skeleton active avatar paragraph={{ rows: 6 }} /></Card></div>;

    if (isError || !appealRecord) return (
        <Result
            status="error"
            title="Link Invalid or Expired"
            subTitle="This appeal link may have already been used or has expired (7-day limit)."
            extra={<Button type="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>}
        />
    );

    const onSubmit = async (values: ActivityAppeal) => {
        try {
            setSubmitting(true)
            await activityAppealService.submit({ ...appealRecord, ...values })
            message.success('Appeal submitted successfully!');
        }
        catch {
            message.error('Failed to submit appeal. Please try again.');
        }

        setSubmitting(false)
    }



    return (
        <div className="flex justify-center items-start py-10 px-4 bg-slate-50 min-h-screen">
            <Card
                className="max-w-2xl w-full shadow-lg border-none rounded-xl overflow-hidden"
                bodyStyle={{ padding: 0 }}
            >
                {/* Header Section */}
                <div className="bg-blue-600 p-6 text-white text-center">
                    <Title level={2} style={{ color: 'white', margin: 0 }}>Request for Appeal</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8, marginBottom: 0 }}>
                        {appealRecord.disapprovedRoleName} Disapproval <ArrowRightOutlined className="mx-2" /> {appealRecord.appealTargetRoleName} Re-evaluation
                    </Paragraph>
                </div>

                <div className="p-8">
                    {/* The "Why was I denied?" Section - Most important for user context */}
                    <Alert
                        message="Reason for Disapproval"
                        description={activity?.remarks || "No specific remarks provided by the reviewer."}
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}

                    />

                    <Space direction="vertical" size="large" className="w-full mt-5">
                        <Descriptions
                            title={<span className="text-blue-600"><InfoCircleOutlined /> Original Application Details</span>}
                            bordered
                            column={1}
                            size="small"
                        >
                            <Descriptions.Item label="Activity">{activity?.title}</Descriptions.Item>
                            <Descriptions.Item label="Type">
                                <Tag color="blue" className="rounded-full">{activity?.activityType?.activityTypeName}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Schedule">
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined className="text-gray-400" />
                                    <span>{formatDateToMilitary(activity?.startDate)} — {formatDateToMilitary(activity?.endDate)}</span>
                                    <BadgeCount count={`${activity?.days} Days`} />
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Original Purpose">
                                <Text type="secondary" italic>"{activity?.reason}"</Text>
                            </Descriptions.Item>
                        </Descriptions>



                        <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-2">
                            <Title level={4} className="mb-4">Your Justification</Title>
                            <Paragraph className="text-gray-500 mb-6">
                                Please provide additional context or documentation to support your appeal.
                                <Tooltip title={`The ${appealRecord.appealTargetRoleName} will review this statement alongside your original application.`}>
                                    <InfoCircleOutlined className="ml-2 cursor-help" />
                                </Tooltip>
                            </Paragraph>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onSubmit}
                            >
                                <Form.Item
                                    name="remarks"
                                    rules={[
                                        { required: true, message: 'Justification is required' },

                                    ]}
                                >
                                    <TextArea
                                        rows={6}
                                        placeholder="Address the disapproval remarks here... (e.g., 'In reference to the manning issue, I have coordinated with...')"
                                        showCount
                                        maxLength={2000}
                                        className="rounded-md"
                                    />
                                </Form.Item>

                                <div className="flex justify-between items-center mt-6">
                                    <Button
                                        type="link"
                                        icon={<RollbackOutlined />}
                                        onClick={() => navigate('/dashboard')}
                                        className="text-gray-400 p-0"
                                    >
                                        I'll do this later
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SendOutlined />}
                                        loading={submitting}

                                        className="px-8 rounded-md bg-blue-600"
                                    >
                                        Submit Appeal
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

// Simple helper for the badge
const BadgeCount = ({ count }: { count: string }) => (
    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">
        {count}
    </span>
);

export default ActivityAppealForm;