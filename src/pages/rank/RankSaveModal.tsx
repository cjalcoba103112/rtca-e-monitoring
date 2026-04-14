import { Form, Input, InputNumber, Modal, Select } from "antd";
import type { Rank } from "../../@types/Rank";
import type { FormInstance } from "antd";
import rankService from "../../services/rankService";
import { useQuery } from "@tanstack/react-query";
import rankCategoryService from "../../services/rankCategoryService";
type SaveModalProps = {
  form: FormInstance<Rank>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRank: Rank | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function RankSaveModal({
  form,
  selectedRank,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const { data: rankCategories } = useQuery({
    queryKey: ["rankCatgories"],
    queryFn: async () => rankCategoryService.getAll(),
    initialData: [],
  });
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRank && selectedRank.rankId) {
        await rankService.update({ ...values, rankId: selectedRank.rankId });
      } else {
        await rankService.add(values);
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
      title={selectedRank ? "Edit Rank" : "Add Rank"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="rankCode"
          label="Rank Code"
          rules={[{ required: true, message: "Please input rank code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rankName"
          label="Rank Name"
          rules={[{ required: true, message: "Please input rank name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rankCategoryId"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select
            options={rankCategories?.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="rankLevel"
          label="Rank Level"
          rules={[{ required: true, message: "Please input rank level" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
