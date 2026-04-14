import { Form, Input, Modal } from "antd";
import type { Department } from "../../@types/Department";
import type { FormInstance } from "antd";
import departmentService from "../../services/departmentService";

type SaveModalProps = {
  form: FormInstance<Department>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDepartment: Department | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function DepartmentSaveModal({
  form,
  selectedDepartment,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (selectedDepartment && selectedDepartment.departmentId) {
        await departmentService.update({
          ...values,
          departmentId: selectedDepartment.departmentId,
        });
      } else {
        await departmentService.add(values);
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
      title={selectedDepartment ? "Edit Department" : "Add Department"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="departmentName"
          label="Department Name"
          rules={[{ required: true, message: "Please input department name" }]}
        >
          <Input />
        </Form.Item>

       
      </Form>
    </Modal>
  );
}