import { Select, Form } from "antd";
import { useQuery } from "@tanstack/react-query";
import personelService from "../services/personelService";
import type { Personnel } from "../@types/Personnel";
import nameFormat from "../utils/nameFormat";

const { Option } = Select;

export type PersonnelSelectProps = {
  name: string;
  label: string;
  required?: boolean;
  // Added onChange prop
  onChange?: (value: number | null, option: any) => void;
};

export default function PersonnelSelectComponent({
  name,
  label,
  required = true,
  onChange, // Destructure here
}: PersonnelSelectProps) {
  const { data: personnelList = [] } = useQuery({
    queryKey: ["personnelList"],
    queryFn: async () => await personelService.getAll(),
  });

  return (
    <Form.Item
      name={name}
      label={label}
      rules={
        required ? [{ required: true, message: `Please select ${label}` }] : []
      }
    >
      <Select
        showSearch
        placeholder={`Select ${label}`}
        optionFilterProp="children"
        allowClear
        onChange={onChange} // Pass it to the Select component
        filterOption={(input, option) =>
          (option?.children?.toString() ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        {personnelList.map((p: Personnel) => (
          <Option key={p.personnelId} value={p.personnelId}>
            {nameFormat(p)}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}