import React from 'react';
import { Card, Descriptions, Tag, Space, Typography, Divider, Button, Alert, List, Checkbox, Spin } from 'antd';
import {
    ClockCircleOutlined,
    FileDoneOutlined,
    InfoCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDaysToYMD } from '../../utils/formatDaysToYMD';
import { formatDateToMilitary } from '../../utils/formatDateToMilitary';
import imageUtility from '../../utils/imageUtility';
import nameFormat from '../../utils/nameFormat';
import emailEteCommunicationService from '../../services/emailEteCommunicationService';

const { Title, Text, Paragraph } = Typography;

const EteNotifyIndex: React.FC = () => {
    const { token } = useParams<{ token: string }>();


    const { data: info, isFetching } = useQuery({
        queryKey: ["ete-warning", token],
        queryFn: async () => await emailEteCommunicationService.getbyToken(token ?? "")
    });
    if (isFetching) return <Spin>Loading....</Spin>
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Title level={3} className="m-0">Proactive ETE Compliance</Title>
                        <Text type="secondary">Early preparation prevents administrative delays.</Text>
                    </div>
                    <Tag color="gold" icon={<ClockCircleOutlined />} className="px-3 py-1 text-sm font-medium">
                        Preparation Phase
                    </Tag>
                </div>

                <Space direction="vertical" size="large" className="w-full">
                    {/* Critical Warning Alert */}
                    <Alert
                        message={<Text strong className="text-amber-900">11-Month Compliance Threshold Notice</Text>}
                        description={
                            <div className="text-amber-800">
                                Administrative regulations require all clearance documents to be finalized **no later than 11 months** prior to your ETE.
                                Currently, you have <b className="underline">{formatDaysToYMD(info?.remainingDays)}</b> remaining.
                                If documents are not submitted within the next {formatDaysToYMD((info?.remainingDays ?? 0) - 335)}, you will be required to submit a **Formal Statement of Explanation**.
                            </div>
                        }
                        type="warning"
                        showIcon
                        className="border-amber-200 bg-amber-50 shadow-sm"
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Left: Personnel Card */}
                        <div className="lg:col-span-1">
                            <Card bordered={false} className="shadow-sm overflow-hidden">
                                <div className="absolute top-0 left-0 h-1 w-full bg-amber-400" />
                                <div className="flex flex-col items-center py-4">
                                    <div className="relative">
                                        <div className="h-28 w-28 rounded-full border-4 border-white bg-slate-200 shadow-md flex items-center justify-center overflow-hidden">
                                            {info?.personnel?.profile ? (
                                                <img src={imageUtility.getProfile(info.personnel.profile)} alt="Profile" />
                                            ) : (
                                                <UserOutlined className="text-4xl text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <Title level={4} className="m-0">{nameFormat(info?.personnel)}</Title>
                                        <Text type="secondary" className="text-xs uppercase tracking-widest">SN: {info?.personnel?.serialNumber}</Text>
                                    </div>
                                </div>

                                <Divider className="my-2" />

                                <Descriptions column={1} size="small" className="mt-4">
                                    <Descriptions.Item label="Current Rank">{info?.personnel?.rank?.rankName}</Descriptions.Item>
                                    <Descriptions.Item label="ETE Date">
                                        <span className="font-bold text-slate-700">{formatDateToMilitary(info?.nextEte)}</span>
                                    </Descriptions.Item>
                                </Descriptions>

                                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-center border border-slate-100">
                                    <Text type="secondary" className="text-xs block mb-1">Status Window Remaining:</Text>
                                    <Text className="text-2xl font-black text-amber-600">
                                        {formatDaysToYMD(info?.remainingDays)}
                                    </Text>
                                </div>
                            </Card>
                        </div>

                        {/* Right: Checklist & Instructions */}
                        <div className="lg:col-span-2">
                            <Card
                                title={<Space><FileDoneOutlined className="text-blue-500" /><span>Required Actions</span></Space>}
                                className="shadow-sm"
                            >
                                <Paragraph>
                                    To maintain your compliance status and avoid the formal explanation process, please ensure the following steps are completed:
                                </Paragraph>

                                <List
                                    itemLayout="horizontal"
                                    dataSource={[
                                        { title: 'Unit Clearance Initiation', desc: 'Visit your S1 to start the clearance routing.' },
                                        { title: 'Medical Records Review', desc: 'Ensure all medical/dental checkups are up to date.' },
                                        { title: 'Finance Pre-audit', desc: 'Resolve any pending financial accountabilities.' },
                                        { title: 'Final Document Upload', desc: 'Submit the completed packet to the digital portal.' }
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item className="px-0">
                                            <Checkbox className="mr-3 mt-1" />
                                            <List.Item.Meta
                                                title={<Text strong>{item.title}</Text>}
                                                description={item.desc}
                                            />
                                        </List.Item>
                                    )}
                                />

                                <Divider />

                                <div className="rounded-lg bg-blue-50 p-4 flex gap-3 border border-blue-100">
                                    <InfoCircleOutlined className="text-blue-500 mt-1" />
                                    <div>
                                        <Text strong className="text-blue-800">Why am I seeing this?</Text>
                                        <br />
                                        <Text className="text-blue-700 text-xs">
                                            Our system flags personnel entering the 12-month window to ensure no one misses the mandatory 11-month finalization cutoff.
                                        </Text>
                                    </div>
                                </div>

                                <div className="mt-8 text-right">
                                    <Button type="primary" size="large" icon={<ArrowRightOutlined />} className="bg-blue-600">
                                        Go to Document Portal
                                    </Button>
                                </div>
                            </Card>
                        </div>

                    </div>
                </Space>
            </div>
        </div>
    );
};

export default EteNotifyIndex;