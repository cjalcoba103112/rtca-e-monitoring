import { Avatar, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Personnel } from "../../@types/Personnel";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import nameFormat from "../../utils/nameFormat";
import PersonnelActivitiesTable from "./PersonnelActivitiesTable";
import { useState } from "react";
import LeaveCreditModal from "./CreditsModal";
import imageUtility from "../../utils/imageUtility";
import {
  UserOutlined,
} from "@ant-design/icons";

export default function LeaveHistoryPage() {
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
    null,
  );
  const [openLeaveCreditModal, setOpenLeaveCreditModal] = useState(false);

  const { data: personnels } = useQuery({
    queryKey: ["personnels"],
    queryFn: async () => await personelService.getAll(),
    initialData: [],
  });
  const personnelColumns: ColumnsType<Personnel> = [
       {
      title: "",
      key:"profile",
      dataIndex:"profile",
      width:120,
     render:(value) =>
       <Avatar
            shape="square"
              size={80}
              src={imageUtility.getProfile(value) }
              icon={!value && <UserOutlined />}
            />
     
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => nameFormat(record),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedPersonnel(record);
            setOpenLeaveCreditModal(true);
          }}
        >
          View Credits
        </Button>
      ),
    },
  ];

  return (
    <>
      <LeaveCreditModal
        open={openLeaveCreditModal}
        onClose={() => setOpenLeaveCreditModal(false)}
        selectedPersonnel={selectedPersonnel}
      />
      <Table
        rowKey="personnelId"
        columns={personnelColumns}
        dataSource={personnels}
        pagination={false}
        sticky
        scroll={{ x: 700 }}
        expandable={{
          expandedRowRender: (record) => (
            <PersonnelActivitiesTable
            selectedPersonnel={record}
            
            />
          ),
          rowExpandable: (record) =>
            (record.personnelActivities?.length || 0) > 0,
        }}
      />
    </>
  );
}
