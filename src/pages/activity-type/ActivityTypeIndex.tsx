import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ActivityType } from "../../@types/ActivityType";
import { useQuery } from "@tanstack/react-query";
import activityTypeService from "../../services/activityTypeService";
import ActivityTypeSaveModal from "./ActivityTypeSaveModal";

const ActivityTypeIndex: React.FC = () => {
  const [selectedActivityType, setSelectedActivityType] =
    useState<ActivityType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: activityTypes,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: async () => await activityTypeService.getAll(),
  });

  const [form] = Form.useForm<ActivityType>();

  const openModal = (activityType?: ActivityType) => {
    if (activityType) {
      form.setFieldsValue(activityType);
      setSelectedActivityType(activityType);
    } else {
      form.resetFields();
      setSelectedActivityType(null);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (activityTypeId?: number) => {
    await activityTypeService.delete(activityTypeId);
    refetch();
  };

  const columns: ColumnsType<ActivityType> = [
    {
      title: "Activity Type Name",
      dataIndex: "activityTypeName",
      key: "activityTypeName",
    },

    {
      title: "Max Credits",
      dataIndex: "maxCredits",
      key: "maxCredits",
      render: (value) => value ?? 0,
    },

    {
      title: "Reset",
      dataIndex: "resetMonths",
      key: "resetMonths",
      render: (value) => {
        if (!value) return;
        switch (value) {
          case 1:
            return "Monthly";
          case 3:
            return "Quarterly";
          case 6:
            return "Semi-Annual";
          case 12:
            return "Yearly";
          default:
            return `${value} months`;
        }
      },
    },

    {
      title: "Mandatory",
      dataIndex: "isMandatoryLeave",
      key: "isMandatoryLeave",
      render: (value) => (value ? "Yes" : "No"),
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
            onConfirm={() => handleDelete(record.activityTypeId)}
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
       Add
      </Button>

      <Table
        pagination={false}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={activityTypes}
        rowKey="activityTypeId"
        size="small"
        loading={isFetching}
        style={{ marginTop: 16 }}
      />

      <ActivityTypeSaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedActivityType={selectedActivityType}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default ActivityTypeIndex;
