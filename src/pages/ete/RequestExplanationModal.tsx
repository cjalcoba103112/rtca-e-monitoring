import React, { useState } from 'react';
import { Modal, Input, Alert, Form, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { EnlistedPersonnelETE } from '../../@types/nonTable/EnlistedPersonnelETE';

const { TextArea } = Input;
const { Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSend: (remarks: string) => void;
  record: EnlistedPersonnelETE|null; 
}

const RequestExplanationModal: React.FC<Props> = ({ visible, onCancel, onSend, record }) => {
  const [form] = Form.useForm();

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onSend(values.remarks);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Request Official Explanation"
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Send Email"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      destroyOnClose
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Alert
          message="Email Notification Notice"
          description={
            <Text>
              By clicking <b>Send Email</b>, an automated request will be sent to 
              <Text code>{record?.email || 'the personnel'}</Text>. This will formally 
              ask for a justification regarding the delay as the status is now below <strong> 11 months</strong>.
            </Text>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="remarks"
          label="Additional Context / Instructions"
          rules={[{ required: true, message: 'Please add a short note for the personnel.' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="e.g., Please clarify why the submission is delayed despite the 335-day threshold..." 
          />
        </Form.Item>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          * This text will be appended to the explanation request email.
        </Text>
      </Form>
    </Modal>
  );
};

export default RequestExplanationModal;