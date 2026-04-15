import { Form, Input, Modal, message, Typography, Divider, Alert } from "antd";
import type { Usertbl } from "../../@types/Usertbl";
import type { FormInstance } from "antd";
import userService from "../../services/userService";
import PersonnelSelectComponent from "../../componets/PersonnelSelectComponent";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import nameFormat from "../../utils/nameFormat";

const { Text } = Typography;

type SaveModalProps = {
    
  form: FormInstance<Usertbl & { personnelId?: number }>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: Usertbl | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function UserSaveModal({
  form,
  selectedUser,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const { data: personnelList = [] } = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => await personelService.getAll(),
    initialData: [],
  });

  // Watch the personnelId to show details of the selected person
  const personnelId = Form.useWatch("personnelId", form);
  const selectedPerson = personnelList.find((p) => p.personnelId === personnelId);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (selectedUser && selectedUser.userId) {
        await userService.update({ ...values, userId: selectedUser.userId });
        message.success("User updated successfully");
      } else {
        // Sending values without manual password; backend handles auto-generation
        await userService.add(values);
        message.success("User created. Credentials sent to email.");
      }
      
      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handlePersonnelChange = (id: number | null) => {
    if (id) {
      const person = personnelList.find(p => p.personnelId === id);
      form.setFieldsValue({ email: person?.email || undefined });
    } else {
      form.setFieldsValue({ email: undefined });
    }
  };

  return (
    <Modal
      title={selectedUser ? "Edit User Account" : "Create User Account"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      destroyOnClose
      okText={selectedUser ? "Update" : "Create Account"}
    >
      <Form form={form} layout="vertical">
        {!selectedUser && (
          <PersonnelSelectComponent 
            name="personnelId" 
            label="Select Personnel" 
            onChange={handlePersonnelChange} 
          />
        )}

        {selectedPerson && (
          <div style={{ marginBottom: 16, padding: '12px', background: '#fafafa', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
            <Text type="secondary">Personnel Details:</Text>
            <div style={{ marginTop: 4 }}>
              <Text strong>{nameFormat(selectedPerson)}</Text> <br />
              <Text type="secondary">SN: {selectedPerson.serialNumber}</Text>
            </div>
          </div>
        )}

        <Form.Item
          name="email"
          label="Account Email"
          extra="This email will be used for login and password recovery."
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email format" }
          ]}
        >
          <Input readOnly={!!selectedPerson?.email} placeholder="Select personnel to load email" />
        </Form.Item>

        <Divider />

        {!selectedUser && (
          <Alert
            message="Auto-generated Password"
            description="For security, the system will generate a random password and send it directly to the email address above once the account is created."
            type="info"
            showIcon
          />
        )}
      </Form>
    </Modal>
  );
}