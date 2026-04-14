// DepartmentIndex.tsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Space,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Department } from "../../@types/Department";
import { useQuery } from "@tanstack/react-query";
import departmentService from "../../services/departmentService";
import DepartmentSaveModal from "./DepartmentSaveModal";

const DepartmentIndex: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: departments,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => await departmentService.getAll(),
  });

  const [form] = Form.useForm<Department>();

  const openModal = (department?: Department) => {
    if (department) {
      form.setFieldsValue(department);
      setSelectedDepartment(department);
    } else {
      form.resetFields();
      setSelectedDepartment(null);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (departmentId?: number) => {
    await departmentService.delete(departmentId);
    refetch();
  };

  const columns: ColumnsType<Department> = [
    {
      title: "Name",
      dataIndex: "departmentName",
      key: "departmentName",
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
            onConfirm={() => handleDelete(record.departmentId ?? undefined)}
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
        Add Department
      </Button>

      <Table
       scroll={{ x: 1000 }}
        columns={columns}
        dataSource={departments}
        size="small"
        rowKey="departmentId"
        loading={isFetching}
      />

      <DepartmentSaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedDepartment={selectedDepartment}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default DepartmentIndex;