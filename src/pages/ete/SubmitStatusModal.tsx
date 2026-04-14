import {
  Descriptions,
  message,
  Modal,
} from "antd";
import type { EnlistedPersonnelETE } from "../../@types/nonTable/EnlistedPersonnelETE";
import dayjs from "dayjs";
import enlistmentRecordService from "../../services/enlistmentRecordService";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import { getStatusTag } from "./EtePage";
type SaveModalProps = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: EnlistedPersonnelETE | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function SubmitStatusModal({
  selectedRecord,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const handleOk = async () => {
    try {
      await enlistmentRecordService.add({
        personnelId: selectedRecord?.personnelId,
        enlistmentStart: selectedRecord?.nextETE,
        contractYears: 3,
        status: "ALREADY SUBMITTED",
        remarks: "ALREADY SUBMITTED",
      });
      onAfterSave();
      message.success("Re-enlistment submitted successfully!");
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };
  const updatedEte =
    selectedRecord?.nextETE &&
    dayjs(selectedRecord.nextETE).add(3, "year").toString();
  return (
    <Modal
      title={"Mark as Submitted"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalVisible}
      onOk={handleOk}
      okText="Submit"
      onCancel={handleClose}
    >
      {selectedRecord && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">
            {nameFormat(selectedRecord)}
          </Descriptions.Item>

          <Descriptions.Item label="Latest Re-Enlistment">
            {selectedRecord.dateOfLatestReEnlistment &&
              formatDateToMilitary(selectedRecord.dateOfLatestReEnlistment)}
            {" → "}
            {selectedRecord.nextETE &&
              formatDateToMilitary(selectedRecord.nextETE)}
          </Descriptions.Item>

          <Descriptions.Item label="Next ETE">
            {selectedRecord.nextETE &&
              formatDateToMilitary(selectedRecord.nextETE)}
            {" → "}
            {selectedRecord.nextETE && formatDateToMilitary(updatedEte)}
          </Descriptions.Item>

          <Descriptions.Item label="Remarks">
            {getStatusTag(
              selectedRecord.remarks,
              selectedRecord.eteDaysRemaining,
            )}
            {" → "}
            {getStatusTag("ALREADY SUBMITTED")}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
