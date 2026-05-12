import { Form, Input, message, Modal } from "antd";
import type { FormInstance } from "antd";
import type { Sidebar } from "../../@types/Sidebar";
import sidebarService from "../../services/sidebarService";

type SaveModalProps = {
  form: FormInstance<Sidebar>;
  setIsModalVisible: (visible: boolean) => void;
  selectedSidebar: Sidebar | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function SidebarSaveModal({ form, selectedSidebar, isModalVisible, setIsModalVisible, onAfterSave }: SaveModalProps) {
  const handleOk = async () => {
  try {
    const values = await form.validateFields();
    
    if (selectedSidebar?.sidebarId) {
      // Use the service that handles the Sidebar table (NOT the mapping table)
      await sidebarService.update({ 
        ...values, 
        sidebarId: selectedSidebar.sidebarId 
      });
      message.success("Sidebar updated successfully");
    } else {
      await sidebarService.add(values);
      message.success("Sidebar added successfully");
    }

    setIsModalVisible(false);
    onAfterSave(); // This triggers the refetch in SidebarIndex
  } catch (error) {
    console.error("Validation or API failed:", error);
  }
};

  return (
    <Modal
      title={selectedSidebar ? "Edit Sidebar" : "Add Sidebar"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="sidebarName" label="Display Name" rules={[{ required: true }]}>
          <Input placeholder="e.g. User Management" />
        </Form.Item>
        <Form.Item name="path" label="Route Path" rules={[{ required: true }]}>
          <Input placeholder="e.g. /user" />
        </Form.Item>
        <Form.Item name="keyName" label="Icon Key (AntD Icon Name)" rules={[{ required: true }]}>
          <Input placeholder="e.g. UserOutlined" />
        </Form.Item>
      </Form>
    </Modal>
  );
}