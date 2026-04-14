import { Divider, Modal } from "antd";
import PersonnelActivitiesTable from "../leave-history/PersonnelActivitiesTable";
import type { Personnel } from "../../@types/Personnel";
import nameFormat from "../../utils/nameFormat";
import Title from "antd/es/typography/Title";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedPersonnel?: Personnel | null;
};

export default function LeaveHistoryModal({
  open,
  onClose,
  selectedPersonnel,
}: Props) {
  return (
    <Modal
      title={
        <Title level={4} style={{ marginBottom: 8 }}>
          {selectedPersonnel ? nameFormat(selectedPersonnel) : "N/A"}
        </Title>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1500}
    >
      <h1>Leave History</h1>

      <Divider />

      {/* 🔹 TABLE */}
      <PersonnelActivitiesTable
        selectedPersonnel={selectedPersonnel}
      />
    </Modal>
  );
}
