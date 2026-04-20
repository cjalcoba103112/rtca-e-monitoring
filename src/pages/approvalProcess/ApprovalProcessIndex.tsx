import React, { useState } from 'react';
import { Table, Steps, Tag, Button, Drawer, Form, Input, Space, Card, Typography, message, Divider } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { PersonnelActivity } from '../../@types/PersonnelActivity';
import ApprovalModal from './ApprovalModal';

const { Title, Text } = Typography;

const mockSelectedActivity:PersonnelActivity = {
  personnel: {
    personnelId: 5,
    profile: "0f66299e-0440-443a-927f-c9a6698d78a8.jpg",
    serialNumber: "O-2914",
    firstName: "JOHN MICHAEL",
    middleName: "Q",
    lastName: "HITA",
    rankId: 11,
    rank: {
      rankId: 11,
      rankCode: "ENS",
      rankName: "Ensign",
      rankLevel: 10,
      rankCategoryId: 1,
      rankCategory: undefined,
    },
    departmentId: null,
    department: null,
    userId: null,
    user: undefined,
    dutyStatus: null,
    employmentStatus: "Active",
    dateEnlisted: "2023-03-06T00:00:00",
    dateEnteredService: null,
    email: "hita.jm08@gmail.com",
    dateOfLastPromotion: null,
    personnelActivities: [], // Usually kept for history/context
    enlistmentRecords: undefined,
  },
  personnelActivityId: 57,
  personnelId: 5,
  activityTypeId: 5,
  activityType: {
    activityTypeId: 5,
    activityTypeName: "PASSES",
    maxCredits: 9,
    resetMonths: 3,
    isMandatoryLeave: false,
  },
  title: "Weekend Pass Request", 
  startDate: "2026-04-19T00:00:00",
  endDate: "2026-04-22T00:00:00",
  status: "Pending Approval",
  result: null,
  remarks: null,
  days: 3,
  reason: "Personal family matters and rest.", // Added a mock reason
  isWarningSent: null,
  isFullyApproved: null,
};

const ApprovalProcessIndex: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<PersonnelActivity|null>(null);
    const [form] = Form.useForm();

    // 1. Open side drawer and load record data
    const showDrawer = (record: any) => {
        setSelectedRecord(record);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    // 2. Handle Submit (CMAA Stage)
    const handleApproval = (isApprove: boolean) => {
        const remarks = form.getFieldValue('remarks');

        // Here you would call your API: 
        // PUT /api/ApprovalProcess/{id} { CmaaIsApprove: isApprove, CmaaRemarks: remarks }

        message.success(`Request ${isApprove ? 'Approved' : 'Rejected'} successfully`);
        onClose();
    };

    const columns = [
        {
            title: 'Request Details',
            render: (record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.activityTitle}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.requestedBy}</Text>
                </Space>
            ),
        },
        {
            title: 'Pipeline',
            width: '40%',
            render: (record: any) => (
                <Steps
                    size="small"
                    current={record.cmaaStatus === null ? 0 : 1}
                    items={[{ title: 'CMAA' }, { title: 'OIC' }, { title: 'CSG' }, { title: 'CO' }]}
                />
            ),
        },
        {
            title: 'Action',
            render: (record: any) => (
                <Button
                    type="primary"
                    ghost
                    icon={<EyeOutlined />}
                    onClick={() => showDrawer(record)}
                >
                    Review
                </Button>
            ),
        },
    ];

    return (
        <Card style={{ margin: '24px' }}>
            <Title level={3}>Pending Approvals</Title>
            <Table
                dataSource={mockData}
                columns={columns}
                rowKey="id"
            />
            <ApprovalModal 
                setIsModalVisible={() => { } }
                selectedActivity={mockSelectedActivity}
                isModalVisible={true}
                onAfterSave={() => { } } 
                currentStage={1} />
        </Card>
    );
};

const mockData = [
    { id: 1, activityTitle: 'Emergency Leave', requestedBy: 'Sgt. John Doe', cmaaStatus: null },
    { id: 2, activityTitle: 'Logistics Seminar', requestedBy: 'Cpl. Jane Smith', cmaaStatus: null },
];

export default ApprovalProcessIndex;