import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Card,
  InputNumber,
  Switch,
} from "antd";
import leaveTypeService from "../../services/Leavetypes";

export type LeaveTypes = {
  leaveTypeID?: number;
  leaveName?: string;
  accrualPerMonth?: number;
  maxPerPeriod?: number;
  resetType?: string;
  accumulation?: boolean;
};

export default function LeaveTypesPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<LeaveTypes>({
    leaveTypeID: undefined,
    leaveName: "",
    accrualPerMonth: 0,
    maxPerPeriod: 0,
    resetType: "",
    accumulation: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  // ✅ FETCH
  const { data: leaveTypes = [], isLoading } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: () => leaveTypeService.getAll(),
  });

  // ✅ CREATE
  const createMutation = useMutation({
    mutationFn: (data: LeaveTypes) => leaveTypeService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      resetForm();
    },
  });

  // ✅ UPDATE
  const updateMutation = useMutation({
    mutationFn: (data: LeaveTypes) => leaveTypeService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      resetForm();
    },
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: number) => leaveTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
    },
  });

  const resetForm = () => {
    setForm({
      leaveTypeID: undefined,
      leaveName: "",
      accrualPerMonth: 0,
      maxPerPeriod: 0,
      resetType: "",
      accumulation: false,
    });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (item: LeaveTypes) => {
    setForm(item);
    setIsEditing(true);
  };

  // ✅ TABLE COLUMNS
  const columns = [
    {
      title: "ID",
      dataIndex: "leaveTypeID",
    },
    {
      title: "Leave Name",
      dataIndex: "leaveName",
    },
    {
      title: "Accrual / Month",
      dataIndex: "accrualPerMonth",
    },
    {
      title: "Max / Period",
      dataIndex: "maxPerPeriod",
    },
    {
      title: "Reset Type",
      dataIndex: "resetType",
    },
    {
      title: "Accumulation",
      dataIndex: "accumulation",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Actions",
      render: (_: any, record: LeaveTypes) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this item?"
            onConfirm={() =>
              deleteMutation.mutate(record.leaveTypeID!)
            }
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Leave Types</h2>

      {/* ✅ FORM */}
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Leave Name"
            value={form.leaveName}
            onChange={(e) =>
              setForm({ ...form, leaveName: e.target.value })
            }
          />

          <InputNumber
            placeholder="Accrual per Month"
            value={form.accrualPerMonth}
            onChange={(val) =>
              setForm({ ...form, accrualPerMonth: val || 0 })
            }
            style={{ width: "100%" }}
          />

          <InputNumber
            placeholder="Max Per Period"
            value={form.maxPerPeriod}
            onChange={(val) =>
              setForm({ ...form, maxPerPeriod: val || 0 })
            }
            style={{ width: "100%" }}
          />

          <Input
            placeholder="Reset Type (Yearly / Monthly)"
            value={form.resetType}
            onChange={(e) =>
              setForm({ ...form, resetType: e.target.value })
            }
          />

          <div>
            <span style={{ marginRight: 10 }}>Accumulation:</span>
            <Switch
              checked={form.accumulation}
              onChange={(checked) =>
                setForm({ ...form, accumulation: checked })
              }
            />
          </div>

          <Space>
            <Button type="primary" onClick={handleSubmit}>
              {isEditing ? "Update" : "Create"}
            </Button>

            {isEditing && (
              <Button onClick={resetForm}>Cancel</Button>
            )}
          </Space>
        </Space>
      </Card>

      {/* ✅ TABLE */}
      <Table
        rowKey="leaveTypeID"
        columns={columns}
        dataSource={leaveTypes}
        loading={isLoading}
      />
    </div>
  );
}