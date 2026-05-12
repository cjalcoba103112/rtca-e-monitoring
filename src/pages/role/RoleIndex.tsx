// RoleIndex.tsx
import React, { useState } from "react";
import { Table, Button, Form, Space, Popconfirm, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Role } from "../../@types/Role";
import { useQuery } from "@tanstack/react-query";
import roleService from "../../services/roleService";
import RoleSaveModal from "./RoleSaveModal";

const RoleIndex: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: roles,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await roleService.getAll(),
  });

  const [form] = Form.useForm<Role>();

  const openModal = (role?: Role) => {
    if (role) {
      form.setFieldsValue(role);
      setSelectedRole(role);
    } else {
      form.resetFields();
      setSelectedRole(null);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (roleId?: number) => {
    await roleService.delete(roleId);
    refetch();
  };

  const columns: ColumnsType<Role> = [
    {
      title: "Name",
      dataIndex: "roleName",
      key: "roleName",
      render: (text, record) => (
        <span>
          {text} {record.isSuperAdmin && <Tag color="gold">Super Admin</Tag>}
        </span>
      ),
    },
    {
      title: "Index Path",
      dataIndex: "indexPath",
      key: "indexPath",
    },
    {
      title: "Access / Sidebars",
      dataIndex: "sidebarRoleMappings",
      key: "sidebarRoleMappings",
      width: 300,
      render: (mappings: Role["sidebarRoleMappings"], record) => {
        if (record?.isSuperAdmin) return <span style={{ color: "#ccc", fontStyle: "italic" }}>All Access</span>;
        if (!mappings || mappings.length === 0) {
          return <span style={{ color: "#ccc", fontStyle: "italic" }}>No Access</span>;
        }

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {mappings.map((m) => (
              <Tooltip title={m.sidebar?.path} key={m.sidebarRoleMappingId}>
                <Tag color="blue" bordered={false}>
                  {m.sidebar?.sidebarName}
                </Tag>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.roleId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => openModal()}>
        Add Role
      </Button>
      <Table
        scroll={{ x: 1000 }}
        size="small"
        columns={columns}
        dataSource={roles}
        rowKey="roleId"
        loading={isFetching}
      />
      <RoleSaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedRole={selectedRole}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default RoleIndex;
