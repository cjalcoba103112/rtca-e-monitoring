import { DatePicker, Form } from "antd";
import type { DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

export type StringDatePickerProps = {
  form: any; // Ant Design form instance
  name: string;
  label: string;
  required?: boolean;
} & Omit<DatePickerProps, "value" | "onChange">;

export default function StringDatePicker({
  form,
  name,
  label,
  required = true,
  placeholder = "Select date",
  ...rest
}: StringDatePickerProps) {
  const value: string | null = form.getFieldValue(name) || null;

  const handleChange: DatePickerProps["onChange"] = (
    date: Dayjs | Dayjs[] | null,
    _
  ) => {
    if (!Array.isArray(date)) {
      form.setFieldsValue({
        [name]: date ? date.toISOString() : null,
      });
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={
        required ? [{ required: true, message: `Please select ${label}` }] : []
      }
    >
      <DatePicker
        style={{ width: "100%" }}
        placeholder={placeholder}
        {...rest}
        value={value ? dayjs(value) : null}
        onChange={handleChange}
      />
    </Form.Item>
  );
}
