import React, { useState } from "react";
import { Table, Button, Form, Space, Popconfirm, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined } from "@ant-design/icons";
import type { Usertbl } from "../../@types/Usertbl";
import { useQuery } from "@tanstack/react-query";
import userService from "../../services/userService";
import UserSaveModal from "./UserSaveModal"; // You will need to create this modal
import nameFormat from "../../utils/nameFormat";
import imageUtility from "../../utils/imageUtility";

const UserIndex: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Usertbl | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: users,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await userService.getAll(),
  });

  const [form] = Form.useForm<Usertbl>();

  const openModal = (user?: Usertbl) => {
    if (user) {
      form.setFieldsValue(user);
      setSelectedUser(user);
    } else {
      form.resetFields();
      setSelectedUser(null);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (userId?: number) => {
    try {
        await userService.delete(userId);
        refetch();
    } catch (error) {
        console.error("Failed to delete user", error);
    }
  };

  const columns: ColumnsType<Usertbl> = [
    {
      title: "Profile",
      key: "profile",
      width:100,
      render: (_, record) => (
       <div style={{ cursor: 'pointer' }}>
      <Image
        width={80}
        height={80}
        style={{ objectFit: 'cover', borderRadius: '4px' }}
        src={imageUtility.getProfile(record.personnel?.profile)}
        fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        placeholder={
          <div style={{ width: 80, height: 80, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <UserOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
          </div>
        }
        preview={{
          mask: <div style={{ fontSize: 12 }}>View</div>, // Shows "View" text on hover
        }}
      />
    </div>
      ),
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email" 
    },
    { 
      title: "Personnel Name", 
      key: "fullName",
      render: (_, record) => {
        const p = record.personnel;
        return p ? nameFormat(p) : "N/A";
      }
    },
    
    {
      title: "Actions",
      key: "actions",
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.userId)}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={() => openModal()}>
          Add User
        </Button>
      </div>

      <Table
        scroll={{ x: 1000 }}
        size="small"
        columns={columns}
        dataSource={users}
        rowKey="userId"
        loading={isFetching}
      />

      <UserSaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedUser={selectedUser}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default UserIndex;