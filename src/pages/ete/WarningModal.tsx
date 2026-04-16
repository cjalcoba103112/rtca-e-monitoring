import React, { useState } from 'react';
import { Modal, Alert, Typography, Form, Input, Space, Avatar, Card, message } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import type { EnlistedPersonnelETE } from '../../@types/nonTable/EnlistedPersonnelETE';
import nameFormat from '../../utils/nameFormat';
import imageUtility from '../../utils/imageUtility';
import { formatDaysToYMD } from '../../utils/formatDaysToYMD';
import emailEteCommunicationService from '../../services/emailEteCommunicationService';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface WarningModalProps {
    visible: boolean;
    onCancel: () => void;
     onAfterSend: () => void;
    record: EnlistedPersonnelETE | null;
}

const WarningModal: React.FC<WarningModalProps> = ({ visible, onCancel, onAfterSend, record }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const personnelName = nameFormat(record) || 'Personnel';

    const handleOk = async() => {
        try {
             const values = await form.validateFields();
             setLoading(true);
       
             await emailEteCommunicationService.add({
               personnelId: record?.personnelId,
               emailCategory: "NOTIFY",
               nextEte: record?.nextETE,
               remarks: values.remarks,
               remainingDays: record?.eteDaysRemaining
             });
       
             message.success('Renewal Reminder sent successfully');
             form.resetFields();
             onAfterSend();
           } catch (error) {
             console.error("Failed to send:", error);
             message.error('Failed to send request. Please try again.');
           } finally {
             setLoading(false);
           }
    };

    return (
        <Modal
            title={
                <Space size="small">
                    <BellOutlined style={{ color: '#faad14' }} />
                    <span>Send Renewal Reminder</span>
                </Space>
            }
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Send Reminder"
            cancelText="Cancel"
            okButtonProps={{loading, style: { backgroundColor: '#faad14', borderColor: '#faad14' } }}
            width={800}
            destroyOnClose
            centered
        >
            <Space direction="vertical" size="large" style={{ display: 'flex', marginTop: 16 }}>

                {/* 1. New Profile Header Card */}
                <Card bodyStyle={{ padding: '16px' }} bordered={true} style={{ background: '#fafafa', borderColor: '#f0f0f0' }}>
                    <Space size="middle" align="start">
                        {/* Avatar/Profile Image */}

                        <Avatar
                            size={64}
                            src={imageUtility.getProfile(record?.profile)} // Replace with your actual image URL property
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#f0f0f0', color: '#bfbfbf', border: '1px solid #d9d9d9' }}
                        />

                        {/* Personnel Details */}
                        <Space direction="vertical" size={0}>
                            <Text type="secondary" style={{ fontSize: '12px', marginBottom: -4 }}>Personnel</Text>
                            <Title level={4} style={{ margin: 0 }}>{personnelName}</Title>
                            <Space size="small">
                                <Text type="secondary">Email:</Text>
                                <Text code>{record?.email || 'N/A'}</Text>
                            </Space>
                        </Space>
                    </Space>
                </Card>

                {/* 2. Repositioned and Cleaned Alert */}
                <Alert
                    message="Advance Notification Window"
                    description={
                        <>
                            This individual has <Text strong color="orange">{formatDaysToYMD(record?.eteDaysRemaining)}</Text> remaining. Sending this will alert them to begin preparing their renewal documentation early.
                        </>
                    }
                    type="warning"
                    showIcon
                />

                {/* 3. Refined Form */}
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="remarks"
                        label={<Text strong>Additional Instructions</Text>}
                        tooltip="This message will be appended to the reminder email."
                    >
                        <TextArea
                            rows={4}
                            placeholder="e.g., Please ensure all clearance and medical documents are attached before submission..."
                        />
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        * This action will trigger an automated email to the personnel.
                    </Text>
                </div>
            </Space>
        </Modal>
    );
};

export default WarningModal;