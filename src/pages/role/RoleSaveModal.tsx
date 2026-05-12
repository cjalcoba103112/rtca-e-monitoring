import { Form, Input, Modal, Checkbox, Select, Divider } from "antd";
import type { Role } from "../../@types/Role";
import type { Sidebar } from "../../@types/Sidebar";
import type { FormInstance } from "antd";
import roleService from "../../services/roleService";
import { sidebarRoleService } from "../../services/sidebarRoleService"; // Use the service we made
import { useState, useEffect } from "react";
import { useAuth } from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";

type SaveModalProps = {
  form: FormInstance<any>; // Changed to any to accommodate the extra sidebarIds field
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRole: Role | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function RoleSaveModal({
  form,
  selectedRole,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 1. Fetch all available sidebars to populate the selection
  const { data: allSidebars = [] } = useQuery({
    queryKey: ["allSidebars"],
    queryFn: sidebarRoleService.getAvailableSidebars,
    enabled: isModalVisible,
  });

  // 2. When editing, we need to pre-fill the selected sidebars
  useEffect(() => {
    if (isModalVisible && selectedRole?.roleId) {
      // If your role object already includes sidebarRoleMappings from the backend Include:
      const initialSidebarIds = selectedRole.sidebarRoleMappings?.map(m => m.sidebarId) || [];
      form.setFieldsValue({ sidebarIds: initialSidebarIds });
    }
  }, [isModalVisible, selectedRole, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Extract sidebarIds from form values
      const { sidebarIds, ...roleData } = values;

      let savedRole: Role;

      if (selectedRole?.roleId) {
        savedRole = await roleService.update({ ...roleData, roleId: selectedRole.roleId });
      } else {
        savedRole = await roleService.add(roleData);
      }

      // 3. Sync the many-to-many relationship
      // Ensure your backend sync service is called to update the mappings
      if (savedRole?.roleId && sidebarIds) {
        await sidebarRoleService.syncPermissions(savedRole.roleId, sidebarIds);
      }

      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.log("Operation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={selectedRole ? "Edit Role" : "Add Role"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
      confirmLoading={loading}
      destroyOnClose
      width={600} // Made it wider for the selection list
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isSuperAdmin: false, sidebarIds: [] }}
      >
        <Form.Item
          name="roleName"
          label="Role Name"
          rules={[{ required: true, message: "Please input role name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="indexPath"
          label="Index Path"
          rules={[{ required: true, message: "Please input index path" }]}
        >
          <Input placeholder="Example: /dashboard" />
        </Form.Item>

        <Divider style={{ fontSize: '14px', color: '#1677ff' }}>Permissions</Divider>

        {/* 4. The Multi-Select for "Many Sidebars" */}
        <Form.Item
          name="sidebarIds"
          label="Accessible Sidebars"
          extra="Select which menu items this role can see in the sidebar."
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Select sidebars"
            options={allSidebars.map((s: Sidebar) => ({
              label: s.sidebarName,
              value: s.sidebarId,
            }))}
            // Logic: If SuperAdmin is checked, maybe disable this since they see everything?
            disabled={form.getFieldValue('isSuperAdmin')}
          />
        </Form.Item>

        {user?.role?.isSuperAdmin && (
          <Form.Item name="isSuperAdmin" valuePropName="checked">
            <Checkbox onChange={() => form.setFieldsValue({ sidebarIds: form.getFieldValue('isSuperAdmin') ? [] : form.getFieldValue('sidebarIds') })}>
              Is Super Administrator?
              <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>
                Super Admins bypass role mappings and see all menus.
              </span>
            </Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}