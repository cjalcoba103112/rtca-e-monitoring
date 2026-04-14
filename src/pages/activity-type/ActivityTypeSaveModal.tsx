import { Form, Input, Modal, InputNumber, Switch } from "antd";
import type { FormInstance } from "antd";
import type { ActivityType } from "../../@types/ActivityType";
import activityTypeService from "../../services/activityTypeService";

type SaveModalProps = {
  form: FormInstance<ActivityType>;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivityType: ActivityType | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function ActivityTypeSaveModal({
  form,
  selectedActivityType,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        activityTypeName: values.activityTypeName?.toUpperCase(),
        maxCredits: values.maxCredits ?? 0,
        resetMonths: values.resetMonths ?? 12,
        isMandatoryLeave: values.isMandatoryLeave ?? false,
      };

      if (selectedActivityType && selectedActivityType.activityTypeId) {
        await activityTypeService.update({
          ...formattedValues,
          activityTypeId: selectedActivityType.activityTypeId,
        });
      } else {
        await activityTypeService.add(formattedValues);
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
      title={selectedActivityType ? "Edit Activity Type" : "Add Activity Type"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleClose}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          maxCredits: 0,
          resetMonths: 12,
          isMandatoryLeave: false,
          ...selectedActivityType,
        }}
      >
        {/* Name */}
        <Form.Item
          name="activityTypeName"
          label="Activity Type Name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input style={{ textTransform: "uppercase" }} />
        </Form.Item>

        {/* Max Credits */}
        <Form.Item
          name="maxCredits"
          label="Max Credits"
          rules={[{ required: true, message: "Enter max credits" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        {/* Reset Months */}
        <Form.Item
          name="resetMonths"
          label="Reset Every (Months)"
          rules={[{ required: true, message: "Enter reset months" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={12}
            step={1}
          />
        </Form.Item>

        {/* Mandatory Leave */}
        <Form.Item
          name="isMandatoryLeave"
          label="Mandatory Leave"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </Modal>
  );
}