import { DatePicker, Form, type FormInstance } from "antd";
import type { Dayjs } from "dayjs";

export type DateRangeComponentProps = {
  form: FormInstance<any>; // Antd Form instance
  startName?: string;
  endName?: string;
  startLabel?: string;
  endLabel?: string;
  required?: boolean;
};

export default function DateRangeComponent({
  form,
  startName = "startDate",
  endName = "endDate",
  startLabel = "Start Date",
  endLabel = "End Date",
  required = true,
}: DateRangeComponentProps) {
  return (
    <>
      <Form.Item
        name={startName}
        label={startLabel}
        rules={
          required
            ? [{ required: true, message: `Please select ${startLabel}` }]
            : []
        }
      >
        <DatePicker
          style={{ width: "100%" }}
          
          disabledDate={(current: Dayjs) => {
            const endDate: Dayjs = form.getFieldValue(endName);
            return endDate ? current && current.isAfter(endDate, "day") : false;
          }}
        />
      </Form.Item>

      <Form.Item
        name={endName}
        label={endLabel}
        rules={
          required
            ? [{ required: true, message: `Please select ${endLabel}` }]
            : []
        }
      >
        <DatePicker
          style={{ width: "100%" }}
          disabledDate={(current: Dayjs) => {
            const startDate: Dayjs = form.getFieldValue(startName);
            return startDate
              ? current && current.isBefore(startDate, "day")
              : false;
          }}
        />
      </Form.Item>
    </>
  );
}
