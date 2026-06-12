import { Form, InputNumber, Modal } from "antd";
import type { LongevityPay } from "../../@types/LongevityPay";
import type { FormInstance } from "antd";
import longevityPayService from "../../services/longevityPayService.ts";
import  { PercentageOutlined } from '@ant-design/icons';

type SaveModalProps = {
  form: FormInstance<LongevityPay>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLongevityPay: LongevityPay | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function LongevityPaySaveModal({
  form,
  selectedLongevityPay,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (selectedLongevityPay && selectedLongevityPay.id) {
        await longevityPayService.update({
          ...values,
          id: selectedLongevityPay.id,
        });
      } else {
        await longevityPayService.add(values);
      }

      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={selectedLongevityPay ? "Edit LongevityPay" : "Add LongevityPay"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="yearsOfService"
          label="Years Of Service"
          rules={[{ required: true, message: "Please input years of service" }]}
        >
          <InputNumber min={0} style={{width:"100%"}} />
        </Form.Item>
      <Form.Item
          name="percentage"
          label="Percentage"
          rules={[{ required: true, message: "Please input perentage" }]}
        >
          <InputNumber min={0} style={{width:"100%"}}  suffix={<PercentageOutlined />}/>
        </Form.Item>

      </Form>
    </Modal>
  );
}