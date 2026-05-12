import React from "react";
import { Modal} from "antd";
import type { Personnel } from "../../@types/Personnel";
import LeaveCreditsFormat from "./LeaveCreditsFormat";

type Props = {
  open?: boolean;
  onClose: () => void;
  selectedPersonnel?: Personnel | null;
};

const LeaveCreditModal: React.FC<Props> = ({
  open,
  onClose,
  selectedPersonnel,
}) => {

  return (
    <Modal
      title="Leave Credits Management"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1400}
      centered
    >
      <LeaveCreditsFormat selectedPersonnel={selectedPersonnel} />
    </Modal>
  );
};

export default LeaveCreditModal;
