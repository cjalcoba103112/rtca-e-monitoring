import React, { useState } from 'react';
import { Modal, Input, Alert, Form, Typography, message, Avatar, Space, Divider, Tag } from 'antd';
import {
  InfoCircleOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  SendOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { EnlistedPersonnelETE } from '../../@types/nonTable/EnlistedPersonnelETE';
import nameFormat from '../../utils/nameFormat';
import emailEteCommunicationService from '../../services/emailEteCommunicationService';
import imageUtility from '../../utils/imageUtility';
import { formatDateToMilitary } from '../../utils/formatDateToMilitary';
import { formatDaysToYMD } from '../../utils/formatDaysToYMD';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onAfterSend: () => void;
  record: EnlistedPersonnelETE | null;
}

const RequestExplanationModal: React.FC<Props> = ({ visible, onCancel, onAfterSend, record }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await emailEteCommunicationService.add({
        personnelId: record?.personnelId,
        emailCategory: "REQUEST EXPLANATION",
        nextEte: record?.nextETE,
        remarks: values.remarks,
        remainingDays: record?.eteDaysRemaining
      });

      message.success('Request for explanation sent successfully');
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
      title={null} // Cleaner custom header
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Send Formal Request"
      cancelText="Cancel"
      okButtonProps={{
        danger: true,
        loading,
        icon: <SendOutlined />,

      }}

      destroyOnClose
      width={700}
      centered
      bodyStyle={{ padding: '24px' }}
    >
      {/* 1. Header with Profile & Summary */}
      <div className="flex items-center gap-5 mb-6">
        <Avatar
          size={90}
          src={imageUtility.getProfile(record?.profile)}
          icon={<UserOutlined />}
          className="border-2 border-gray-100 shadow-sm flex-shrink-0"
          style={{ backgroundColor: '#001529' }}
        />
        <div className="flex-grow">
          <Title level={4} className="m-0 text-gray-800">Request Official Explanation</Title>
          <Text className="text-lg text-gray-500 block mb-2">{nameFormat(record)}</Text>
          <div className="flex flex-wrap gap-2">
            <Tag icon={<MailOutlined />} color="blue">
              {record?.email || 'No email on record'}
            </Tag>
            <Tag icon={<CalendarOutlined />} color="cyan">
              ETE: {formatDateToMilitary(record?.nextETE)}
            </Tag>
            <Tag icon={<ClockCircleOutlined />} color="volcano">
              {formatDaysToYMD(record?.eteDaysRemaining)} Left
            </Tag>
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      {/* 2. Compliance Warning Alert */}
      <Alert
        className="mb-6 rounded-lg border-amber-200"
        message={<Text strong className="text-amber-800">Compliance Action Required</Text>}
        description={
          <Text className="text-amber-700 text-xs sm:text-sm">
            This personnel is currently at <b>{formatDaysToYMD(record?.eteDaysRemaining)}</b> remaining, which is below the <b>11-month</b> document finalization threshold.
            Sending this request creates a formal audit trail and requires the personnel to submit a justification via the secure portal.
          </Text>
        }
        type="warning"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {/* 3. Form Input */}
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="remarks"
          label={
            <Space>
              <Text strong className="text-gray-700">Official Instructions</Text>
              <Text type="secondary" className="font-normal">(Appended to email)</Text>
            </Space>
          }
          rules={[{ required: true, message: 'Please provide instructions for the personnel.' }]}
        >
          <TextArea
            rows={5}
            placeholder="e.g., Your ETE compliance status is currently critical. Please provide a formal explanation regarding the delay in your document finalization..."
            className="rounded-md border-gray-300"
          />
        </Form.Item>

        {/* 4. Help Note */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed">
          <div className="flex gap-3">
            <InfoCircleOutlined className="text-gray-400 mt-1" />
            <Text type="secondary" className="text-xs leading-relaxed">
              Upon clicking "Send", the system will generate a unique access token.
              The personnel will receive an email containing your instructions and a secure button
              to upload their <b>Statement of Explanation</b> and <b>Supporting Documents (PDF)</b>.
            </Text>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default RequestExplanationModal;