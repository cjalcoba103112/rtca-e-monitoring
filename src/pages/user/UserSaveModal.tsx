import React, { useEffect, useState } from "react";
import { Form, Input, Modal, message, Typography, Alert, Select, Image, Space } from "antd";
import type { Usertbl } from "../../@types/Usertbl";
import type { FormInstance } from "antd";
import userService from "../../services/userService";
import PersonnelSelectComponent from "../../componets/PersonnelSelectComponent";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import nameFormat from "../../utils/nameFormat";
import roleService from "../../services/roleService";
import type { Role } from "../../@types/Role";
import imageUtility from "../../utils/imageUtility";
import { UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

type SaveModalProps = {
  form: FormInstance<Usertbl>;
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
  const [loading, setLoading] = useState(false);

  // Sync form values when selectedUser changes (Edit Mode)
  useEffect(() => {
    console.log(isModalVisible, selectedUser)
    if (isModalVisible) {
      const userEmail = selectedUser?.personnel?.email;
      // If userName is null/empty, extract prefix from email. If no email, fallback to undefined.
      const initialUserName = selectedUser?.userName || (userEmail ? userEmail.split("@")[0] : undefined);
      form.setFieldsValue({
        userName: initialUserName,
        email: userEmail,
        roleId: selectedUser?.roleId,
        personnelId: selectedUser?.personnelId,
      });
    } else if (!isModalVisible) {
      form.resetFields();
    }
  }, [isModalVisible]);

  const { data: personnelList = [] } = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => await personelService.getAll(),
    initialData: [],
    enabled: isModalVisible,
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["userTypes"],
    queryFn: async () => await roleService.getAll(),
    initialData: [],
    enabled: isModalVisible,
  });

  const personnelId = Form.useWatch("personnelId", form);
  const selectedPerson = personnelList.find((p) => p.personnelId === personnelId);

  const displayPerson = selectedUser?.personnel || selectedPerson;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (selectedUser?.userId) {
        await userService.update({ ...selectedUser, ...values, userId: selectedUser.userId });
        message.success("User updated successfully");
      } else {
        await userService.add(values);
        message.success("User created. Credentials sent to email.");
      }

      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.error("Validation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonnelChange = (id: number | null) => {
    const person = personnelList.find((p) => p.personnelId === id);
    form.setFieldsValue({
      email: person?.email || undefined,
      userName: person?.email ? person.email.split("@")[0] : undefined,
    });
  };

  return (
    <Modal
      title={selectedUser ? "Edit User Account" : "Create New User Account"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      destroyOnClose
      okText={selectedUser ? "Save Changes" : "Create Account"}
      confirmLoading={loading}
      width={520}
    >
      {/* Profile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #f0f0f0",
        }}
      >
        <Image
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          src={imageUtility.getProfile(displayPerson?.profile)}
          fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          preview={!!displayPerson}
        />
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {displayPerson ? nameFormat(displayPerson) : "No Personnel Selected"}
          </Title>
          {displayPerson ? (
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <IdcardOutlined /> {displayPerson.serialNumber || "No SN"}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <MailOutlined /> {displayPerson.email || "No Email"}
              </Text>
            </Space>
          ) : (
            <Text type="secondary">Link a personnel record to continue.</Text>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical">

        <div style={{ marginBottom: "12px" }} hidden={!!selectedUser?.personnelId}>
          <PersonnelSelectComponent
            required={false}
            name="personnelId"
            label="Personnel Reference"
            onChange={handlePersonnelChange}
          />
        </div>


        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="userName"
            label="Username"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              loading={rolesLoading}
              options={roles?.map((role: Role) => ({
                label: role.roleName,
                value: role.roleId,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Account Email"
          extra={!selectedUser && "This is where login credentials will be sent."}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            readOnly={!!selectedPerson || !!selectedUser}
            variant={selectedPerson || selectedUser ? "filled" : "outlined"}
          />
        </Form.Item>

        {!selectedUser && (
          <Alert
            message="Credentials"
            description="The system will email an auto-generated password to the user."
            type="info"
            showIcon
          />
        )}
      </Form>
    </Modal>
  );
}