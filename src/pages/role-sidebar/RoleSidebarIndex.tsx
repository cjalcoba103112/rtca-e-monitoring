import React, { useState } from "react";
import { Table, Button, Form, Space, Popconfirm, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons"; // Added for better UI
import type { ColumnsType } from "antd/es/table";
import type { Sidebar } from "../../@types/Sidebar";
import { useQuery } from "@tanstack/react-query";
import sidebarService from "../../services/sidebarService";
import SidebarSaveModal from "./SidebarSaveModal";

const SidebarIndex: React.FC = () => {
    const [selectedSidebar, setSelectedSidebar] = useState<Sidebar | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm<Sidebar>();

    const { data: sidebars, refetch, isFetching } = useQuery({
        queryKey: ["sidebars"],
        queryFn: async () => await sidebarService.getAll(),
    });

    const openModal = (sidebar?: Sidebar) => {
        if (sidebar) {
            form.setFieldsValue(sidebar);
            setSelectedSidebar(sidebar);
        } else {
            form.resetFields();
            setSelectedSidebar(null);
        }
        setIsModalVisible(true);
    };

    const columns: ColumnsType<Sidebar> = [
        { title: "Menu Name", dataIndex: "sidebarName", key: "sidebarName" },
        { title: "Path", dataIndex: "path", key: "path" },
        { title: "Icon Key", dataIndex: "keyName", key: "keyName" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>Edit</Button>
                    <Popconfirm 
                        title="Delete this menu item?" 
                        onConfirm={() => sidebarService.delete(record.sidebarId).then(() => refetch())}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card bordered={false}>
                {/* --- Add Button Section --- */}
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => openModal()}
                    >
                        Add Sidebar Item
                    </Button>
                </div>
                {/* ------------------------- */}

                <Table
                    size="small"
                    columns={columns}
                    dataSource={sidebars}
                    rowKey="sidebarId"
                    loading={isFetching}
                    scroll={{ x: 800 }} // Added for responsiveness
                />
            </Card>

            <SidebarSaveModal
                form={form}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                selectedSidebar={selectedSidebar}
                onAfterSave={refetch}
            />
        </div>
    );
};

export default SidebarIndex;