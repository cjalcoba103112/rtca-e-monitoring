import { useState } from 'react';
import { Card, Tabs, List, Select, Typography, Tag, Space, Divider, message } from 'antd';
import { CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import roleService from '../../services/roleService';
import type { Role } from '../../@types/Role';
import workflowStepsService from '../../services/workflowStepsService';
import type { WorkflowStep } from '../../@types/WorkflowStep';

const { Text } = Typography;

type WorkflowStepType = WorkflowStep & { category?: string | null };

const initialWorkflows: WorkflowStepType[] = [
    { id: null, rankCategoryId: 2, category: "Non-Officer", stepNumber: 1, roleId: null },
    { id: null, rankCategoryId: 2, category: "Non-Officer", stepNumber: 2, roleId: null },
    { id: null, rankCategoryId: 2, category: "Non-Officer", stepNumber: 3, roleId: null },
    { id: null, rankCategoryId: 2, category: "Non-Officer", stepNumber: 4, roleId: null },
    { id: null, rankCategoryId: 1, category: "Officer", stepNumber: 1, roleId: null },
    { id: null, rankCategoryId: 1, category: "Officer", stepNumber: 2, roleId: null },
];

const ApproverPage = () => {
    const [workflow, setWorkflow] = useState<WorkflowStepType[]>([]);

    // 1. Fetch Workflow Steps
    const { isLoading: isWorkflowLoading } = useQuery({
        queryKey: ["workflowSteps"],
        queryFn: async () => {
            const data = await workflowStepsService.getAll();
            const result: WorkflowStepType[] = data?.map(d => ({
                ...d,
                category: d.rankCategory?.name,
            })) ?? [];

            const finalData = result.length > 0 ? result : initialWorkflows;
            setWorkflow(finalData);
            return finalData;
        },
    });

    // 2. Fetch Roles
    const { data: roles = [], isLoading: isRolesLoading } = useQuery<Role[]>({
        queryKey: ["roles"],
        queryFn: async () => {
            const data = await roleService.getAll();
            return data || [];
        }
    });

const handleUpdateRoleAssignment = async (stepNumber: number, category: string, roleId: number | null) => {
    const updatedWorkflow = workflow.map(item => {
        if (item.stepNumber === stepNumber && item.category === category) {
            return { ...item, roleId: roleId };
        }
        return item;
    });
    setWorkflow(updatedWorkflow);

    try {
        await workflowStepsService.bulkUpsert(updatedWorkflow);
        message.success(`Updated Step ${stepNumber} for ${category}`);
    } catch (error) {
        console.error("Failed to sync workflow:", error);
        message.error("Failed to save changes");
    }
};
    const renderStepList = (categoryName: string) => {
        const filteredSteps = workflow
            .filter(w => w.category === categoryName)
            .sort((a, b) => (a.stepNumber ?? 0) - (b.stepNumber ?? 0));

        return (
            <List
                itemLayout="vertical"
                dataSource={filteredSteps}
                renderItem={(item, index) => {
                    const isFinal = index === filteredSteps.length - 1;
                    const selectedRole = roles.find(r => r.roleId === item.roleId);
                    const dynamicLabel = selectedRole
                        ? `${selectedRole.roleName} Approval`
                        : "Unassigned Approval Step";

                    return (
                        <List.Item
                            key={item.id} // Important for React list rendering
                            style={{
                                background: isFinal ? '#f6ffed' : '#fff',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                border: isFinal ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Space align="start" size="middle">
                                    <AvatarBadge step={item.stepNumber ?? 0} isFinal={isFinal} />
                                    <div>
                                        <Space>
                                            <Text strong style={{ fontSize: '16px' }}>{dynamicLabel}</Text>
                                            {isFinal && <Tag color="success">Final Authority</Tag>}
                                        </Space>
                                        <br />
                                        <Text type="secondary">
                                            Step {item.stepNumber}: {categoryName} workflow hierarchy.
                                        </Text>
                                    </div>
                                </Space>
                            </div>

                            <Divider style={{ margin: '12px 0' }} />

                            <div style={{ paddingLeft: '56px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    <SafetyCertificateOutlined /> Assigned Approver Role:
                                </Text>
                                <Select
                                    showSearch
                                    allowClear
                                    loading={isRolesLoading}
                                    placeholder="Select a role (e.g., CMAA)"
                                    style={{ width: '100%' }}
                                    value={item.roleId}
                                    onChange={(val) => handleUpdateRoleAssignment(item.stepNumber ?? 0, categoryName, val)}
                                    options={roles.map(r => ({
                                        label: r.roleName,
                                        value: r.roleId
                                    }))}
                                    optionFilterProp="label"
                                />
                            </div>
                        </List.Item>
                    );
                }}
            />
        );
    };

    return (
        <div style={{ padding: '24px 50px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 24 }}>
                <Typography.Title level={3}>Workflow Configuration</Typography.Title>
                <Text type="secondary">Assign roles to specific approval stages for each personnel category.</Text>
            </div>

            <Card bordered={false} bodyStyle={{ padding: 0 }} loading={isWorkflowLoading}>
                <Tabs
                    type="line"
                    size="large"
                    items={[
                        {
                            key: 'Non-Officer',
                            label: (
                                <div style={{ padding: '0 10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Non-Officer Chain</div>
                                    <Text style={{ fontSize: '11px' }} type="secondary">CMAA → OIC → CSG → DIR</Text>
                                </div>
                            ),
                            children: <div style={{ padding: '20px' }}>{renderStepList("Non-Officer")}</div>,
                        },
                        {
                            key: 'Officer',
                            label: (
                                <div style={{ padding: '0 10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Officer Chain</div>
                                    <Text style={{ fontSize: '11px' }} type="secondary">ASST DIR → DIR</Text>
                                </div>
                            ),
                            children: <div style={{ padding: '20px' }}>{renderStepList("Officer")}</div>,
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

const AvatarBadge = ({ step, isFinal }: { step: number, isFinal: boolean }) => (
    <div style={{
        width: 40, height: 40, borderRadius: '8px',
        background: isFinal ? '#52c41a' : '#722ed1',
        color: '#fff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '18px', fontWeight: 'bold'
    }}>
        {isFinal ? <CheckCircleOutlined /> : step}
    </div>
);

export default ApproverPage;