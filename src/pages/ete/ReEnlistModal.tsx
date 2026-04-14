import { Descriptions,  Modal } from "antd";
import type { EnlistedPersonnelETE } from "../../@types/nonTable/EnlistedPersonnelETE";
import dayjs from "dayjs";
type SaveModalProps = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: EnlistedPersonnelETE | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function ReEnlistModal({
  selectedRecord,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const handleOk = async () => {
    onAfterSave()
    // try {
    //   const values = await form.validateFields();
    //   if (selectedRank && selectedRank.rankId) {
    //     await rankService.update({ ...values, rankId: selectedRank.rankId });
    //   } else {
    //     await rankService.add(values);
    //   }
    //   setIsModalVisible(false);
    //   onAfterSave();
    // } catch (err) {
    //   console.log("Validation failed:", err);
    // }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title={"Re Enlist"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
    >
      {selectedRecord && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">
            {`${selectedRecord.lastName}, ${selectedRecord.firstName} ${selectedRecord.middleName ?? ""}`}
          </Descriptions.Item>

          <Descriptions.Item label="Next ETE">
            {selectedRecord.nextETE &&
              dayjs(selectedRecord.nextETE).format("MMMM D, YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Years in Service">
            {selectedRecord.yearsInService ?? "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Remarks">
            {selectedRecord.remarks ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
