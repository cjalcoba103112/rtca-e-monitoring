import React, { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  Table,
  Button,
  Space,
  Form,
  Tag,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";
import { useQuery } from "@tanstack/react-query";
import personnelActivityService from "../../services/personnelActivityService";
import type { Personnel } from "../../@types/Personnel";
import type { ActivityType } from "../../@types/ActivityType";
import nameFormat from "../../utils/nameFormat";
import { convertUtcToPhDateShort } from "../../utils/convertUtcToPhDateShort";
import DebounceInput from "../../componets/DebounceInput";
import PersonnelActivityApprovalModal from "./PersonnelActivityApprovalModal";
import activityTypeService from "../../services/activityTypeService";
import { SearchOutlined } from "@ant-design/icons";

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

const ApprovalLeave: React.FC = () => {
  const [selectedActivity, setSelectedActivity] =
    useState<PersonnelActivity | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<PersonnelActivity[]>([]);
  const {
    data: activities,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["personnelActivities"],
    queryFn: async () => await personnelActivityService.getAll(),
    initialData: [],
  });
  const { data: activityTypes } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: async () => await activityTypeService.getAll(),
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


  const columns: ColumnsType<PersonnelActivity> = [
    {
        title: "Personnel",
        dataIndex: "personnel",
        key: "personnel",
     
        render: (value: Personnel) => nameFormat(value),
        // --- SEARCH LOGIC FOR NAME ---
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search Personnel"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && clearFilters()}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
          nameFormat(record.personnel)
            .toLowerCase()
            .includes((value as string).toLowerCase()),
      },
      {
        title: "Activity Type",
        dataIndex: "activityType",
        key: "activityType",
        width: 150,
        render: (value: ActivityType) => value.activityTypeName,
        filters:
          activityTypes?.map((c) => ({
            text: c.activityTypeName || "Unknown",
  
            value: c.activityTypeName ?? "",
          })) ?? [],
  
        onFilter: (value, record) =>
          record?.activityType?.activityTypeName?.includes(value as string) ??
          true,
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        align: "center",
        width: 130,
        sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
        render: (date) => convertUtcToPhDateShort(date),
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        align: "center",
        width: 130,
        sorter: (a, b) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
        render: (date) => convertUtcToPhDateShort(date),
      },
    {
      title: "Day/s",
      dataIndex: "days",
      key: "days",
      align: "center",
      width: 130,
     
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
                View
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
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
        title={() => "Pending Approvals"}
        scroll={{ x: 1000 }}
        size="small"
        columns={columns}
        dataSource={
          filteredData.length
            ? filteredData.filter((c) => c.status == "Pending Approval")
            : activities.filter((c) => c.status == "Pending Approval")
        }
        rowKey="personnelActivityId"
        loading={isFetching}
        style={{ marginTop: 16 }}
      />
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

      <PersonnelActivityApprovalModal
      
        setIsModalVisible={setIsModalVisible}
        selectedActivity={selectedActivity}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default ApprovalLeave;
