// PersonnelIndex.tsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Form,
  Tag,
  Tooltip,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Personnel } from "../../@types/Personnel";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import PersonelSaveModal from "./PersonelSaveModal";
import dayjs, { Dayjs } from "dayjs";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import DebounceInput from "../../componets/DebounceInput";
import nameFormat from "../../utils/nameFormat";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import CreditsModal from "../leave-history/CreditsModal";
import imageUtility from "../../utils/imageUtility";
import PersonnelActivitiesTable from "../leave-history/PersonnelActivitiesTable";
import UserSaveModal from "../user/UserSaveModal";
import type { Usertbl } from "../../@types/Usertbl";

export type PersonnelForm = Omit<
  Personnel,
  "dateEnlisted" | "dateEnteredService" | "dateOfLastPromotion"
> & {
  dateEnlisted?: Dayjs | null;
  dateEnteredService?: Dayjs | null;
  dateOfLastPromotion?: Dayjs | null;
};

export const emptyPersonnel: Personnel = {
  personnelId: null,
  profile: null,
  serialNumber: null,
  firstName: null,
  middleName: null,
  lastName: null,

  rankId: null,
  rank: null,

  departmentId: null,
  department: null,
  email: null,
  employmentStatus: "Active",
  dateEnlisted: null,
  dateEnteredService: null,
  dateOfLastPromotion: null,
  personnelActivities: [],
};

const PersonnelIndex: React.FC = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: personnelList,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => await personelService.getAll(),
    initialData: [],
  });
  const [filteredData, setFilteredData] = useState<Personnel[]>(personnelList);
  const [leaveHistoryModal, setLeaveHistoryModal] = useState<boolean>(false);
  const [form] = Form.useForm<PersonnelForm>();
const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userForm] = Form.useForm<Usertbl>();
  
  const openHistoryModal = (record: Personnel) => {
    setSelectedPersonnel(record);
    setLeaveHistoryModal(true);
  };

  const openModal = (personnel?: Personnel) => {
    if (personnel) {
      form.setFieldsValue({
        ...personnel,
        dateEnlisted: personnel.dateEnlisted
          ? dayjs(personnel.dateEnlisted)
          : null,

        dateEnteredService: personnel.dateEnteredService
          ? dayjs(personnel.dateEnteredService)
          : null,
        dateOfLastPromotion: personnel.dateOfLastPromotion
          ? dayjs(personnel.dateOfLastPromotion)
          : null,
      });
      setSelectedPersonnel(personnel);
    } else {
      form.setFieldsValue(emptyPersonnel);
      setSelectedPersonnel(null);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (personnelId?: number) => {
    await personelService.delete(personnelId);
    refetch();
  };

  const openUserModal = (personnel: Personnel) => {
    userForm.resetFields();
    userForm.setFieldsValue({
      
      email: personnel.email || undefined,
    });
    setSelectedPersonnel(personnel); // Reuse selectedPersonnel to track who we are adding for
    setIsUserModalVisible(true);
  };

  const columns: ColumnsType<Personnel> = [
    {
      title: "Nr",
      width: 45,
      render: (_, __, index) => index + 1,
    },
    {
      title: "",
      key: "profile",
      dataIndex: "profile",
      width: 120,
      render: (value) => (
        <div style={{ cursor: "pointer" }}>
          <Image
            width={80}
            height={80}
            style={{ objectFit: "cover", borderRadius: "4px" }}
            src={imageUtility.getProfile(value)}
            fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            placeholder={
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ fontSize: 24, color: "#bfbfbf" }} />
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
      title: "Name",
      dataIndex: "lastName",
      key: "lastname",
      render: (_, value: Personnel) => nameFormat(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Duty Status",
      dataIndex: "employmentStatus",
      key: "employmentStatus",
      render: (status: string | null) => {
        if (!status) return null;

        let color = "default";

        if (status.toLowerCase() === "active") {
          color = "green";
        } else if (status.toLowerCase() === "inactive") {
          color = "orange";
        } else if (status.toLowerCase() === "suspended") {
          color = "red";
        }

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date Entered Service",
      dataIndex: "dateEnteredService",
      key: "dateEnteredService",
      render: (value) => (value ? formatDateToMilitary(value) : ""),
    },
    {
      title: "Date Enlisted/Commissioned",
      dataIndex: "dateEnlisted",
      key: "dateEnlisted",
      render: (value) => (value ? formatDateToMilitary(value) : ""),
    },
    {
      title: "Last Promotion",
      dataIndex: "dateOfLastPromotion",
      key: "dateOfLastPromotion",
      render: (value) => (value ? formatDateToMilitary(value) : ""),
    },
    {
      title: "Has Account",
      key: "hasAccount",
      width: 100,
      align: "center",
      // Filterable to quickly find people without accounts
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => !!record.userId === value,
      render: (_, record) => {
        const hasAccount = !!record.userId || !!record.user;
        return (
          <Tag color={hasAccount ? "blue" : "default"}>
            {hasAccount ? "YES" : "NO"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Leave Credits">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => openHistoryModal(record)}
            />
          </Tooltip>
{!record.userId && (
            <Tooltip title="Create System Account">
              <Button 
                type="text" 
                style={{ color: '#722ed1' }} 
                icon={<UserAddOutlined />} 
                onClick={() => openUserModal(record)} 
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => handleDelete(record?.personnelId ?? 0)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];


  return (
    <div>
      <div className="flex justify-between">
        <Button type="primary" onClick={() => openModal()}>
          Add Personnel
        </Button>
        <DebounceInput
          placeholder="Search Name..."
          style={{ width: 250 }}
          onChange={(value) => {
            const keyword = value.toLowerCase().trim();

            if (!keyword) {
              setFilteredData(personnelList);
              return;
            }

            const result = personnelList.filter((item) => {
              const name = nameFormat(item || {}).toLowerCase();
              return name.includes(keyword);
            });

            setFilteredData(result);
          }}
        />
      </div>

      <Table
        sticky
        scroll={{ x: true }}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={filteredData.length ? filteredData : personnelList}
        rowKey="personnelId"
        loading={isFetching}
        expandable={{
          expandedRowRender: (record) => (
            <PersonnelActivitiesTable selectedPersonnel={record} />
          ),
          rowExpandable: (record) =>
            (record.personnelActivities?.length || 0) > 0,
        }}
      />
<UserSaveModal
        form={userForm}
        isModalVisible={isUserModalVisible}
        setIsModalVisible={setIsUserModalVisible}
        selectedUser={null} // Always null because we are adding from this screen
        onAfterSave={refetch} // Refetch personnel to update "Has Account" tag
      />
      <CreditsModal
        open={leaveHistoryModal}
        onClose={() => setLeaveHistoryModal(false)}
        selectedPersonnel={selectedPersonnel}
      />
      <PersonelSaveModal
        form={form}
        setIsModalVisible={setIsModalVisible}
        selectedPersonnel={selectedPersonnel}
        isModalVisible={isModalVisible}
        onAfterSave={refetch}
      />
    </div>
  );
};

export default PersonnelIndex;
