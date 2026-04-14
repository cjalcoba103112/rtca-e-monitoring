import React, { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Form,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";
import { useQuery } from "@tanstack/react-query";
import personnelActivityService from "../../services/personnelActivityService";
import PersonnelActivitySaveModal from "./PersonnelActivitySaveModal";
import type { Personnel } from "../../@types/Personnel";
import type { ActivityType } from "../../@types/ActivityType";
import nameFormat from "../../utils/nameFormat";
import { convertUtcToPhDateShort } from "../../utils/convertUtcToPhDateShort";
import DebounceInput from "../../componets/DebounceInput";

dayjs.extend(isBetween);

export const emptyValues: PersonnelActivity = {
  personnelActivityId: null,
  personnelId: null,
  personnel: null,
  activityTypeId: null,
  activityType: null,
  title: null,
  startDate: null,
  endDate: null,
  status: "Pending Approval",
  result: null,
  remarks: null,
};

const RequestLeave: React.FC = () => {
  const [selectedActivity, setSelectedActivity] =
    useState<PersonnelActivity | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<PersonnelActivity[]>([]);
  const [selectedStatus, _] = useState<string>("");
  const {
    data: activities,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["personnelActivities", selectedStatus],
    queryFn: async () => await personnelActivityService.getAll(),
    initialData: [],
  });

  const [form] = Form.useForm();

  const openModal = (activity?: PersonnelActivity) => {
    if (activity) {
      form.setFieldsValue({
        ...activity,
        startDate: activity.startDate ? dayjs(activity.startDate) : undefined,
        endDate: activity.endDate ? dayjs(activity.endDate) : undefined,
      });
      setSelectedActivity(activity);
    } else {
      form.setFieldsValue(emptyValues);
      setSelectedActivity(null);
    }
    setIsModalVisible(true);
  };

  //   const handleDelete = async (id?: number | null) => {
  //     await personnelActivityService.delete(id);
  //     refetch();
  //   };

  // ------------------- Suspend Action -------------------
  const handleSuspend = async (activity: PersonnelActivity) => {
    if (!activity.personnelActivityId) return;
    try {
      await personnelActivityService.update({
        ...activity,
        status: "Suspended",
      });
      message.success("Activity suspended successfully");
      refetch();
    } catch (error) {
      message.error("Failed to suspend activity");
    }
  };

  const columns: ColumnsType<PersonnelActivity> = [
    {
      title: "Personnel",
      dataIndex: "personnel",
      key: "personnel",
      render: (value: Personnel) => nameFormat(value),
    },
    {
      title: "Activity Type",
      dataIndex: "activityType",
      key: "activityType",
      render: (value: ActivityType) => value.activityTypeName,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => convertUtcToPhDateShort(date),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => convertUtcToPhDateShort(date),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const today = dayjs().startOf("day");
        const start = record.startDate
          ? dayjs(record.startDate).startOf("day")
          : null;
        const end = record.endDate
          ? dayjs(record.endDate).startOf("day")
          : null;

        let statusText = "";
        let color = "";

        switch (true) {
           case record.status === "Pending Approval":
            statusText = "Pending Approval";
            color = "gold";
            break;

             case record.status === "Declined":
            statusText = "Declined";
            color = "red";
            break;

          case record.status === "Suspended":
            statusText = "Suspended";
            color = "red";
            break;

          case start &&
            end &&
            (today.isSame(start, "day") ||
              today.isSame(end, "day") ||
              (today.isAfter(start, "day") && today.isBefore(end, "day"))):
            statusText = "Ongoing";
            color = "blue";
            break;

          case end && today.isAfter(end, "day"):
            statusText = "Inactive";
            color = "default";
            break;

          default:
            statusText = "Scheduled";
            color = "gold";
            break;
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status == "Pending Approval" && (
            <>
              <Button type="link" onClick={() => openModal(record)}>
                Edit
              </Button>
              <Popconfirm
                title="Suspend this activity?"
                onConfirm={() => handleSuspend(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" style={{ color: "#ff4d4f" }}>
                  Suspend
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];


  return (
    <div>
      <Button type="primary" onClick={() => openModal()}>
        Request Leave
      </Button>
      <Table
        scroll={{ x: 1000 }}
        size="small"
        title={() => "Pending Approval"}
        columns={columns}
        dataSource={activities.filter((c) => c.status == "Pending Approval")}
        rowKey="personnelActivityId"
        loading={isFetching}
        style={{ marginTop: 16 }}
      />
      <div className="flex justify-end">
        <DebounceInput
          placeholder="Search Name..."
          style={{ width: 250 }}
          onChange={(value) => {
            const keyword = value.toLowerCase().trim();

            if (!keyword) {
              setFilteredData(activities);
              return;
            }

            const result = activities.filter((item) => {
              const name = nameFormat(item.personnel || {}).toLowerCase();
              return name.includes(keyword);
            });

            setFilteredData(result);
          }}
        />
      </div>

      <Table
        scroll={{ x: 1000 }}
        size="small"
        columns={columns}
        dataSource={
          filteredData.length
            ? filteredData.filter((c) => c.status != "Pending Approval")
            : activities.filter((c) => c.status != "Pending Approval")
        }
        rowKey="personnelActivityId"
        loading={isFetching}
        style={{ marginTop: 16 }}
        title={() => "History"}
      />

      <PersonnelActivitySaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedActivity={selectedActivity}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default RequestLeave;
