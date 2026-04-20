import React, { useState } from "react";
import { Modal, Form, Select, Tag, Image, Input, Alert, DatePicker, Space, Divider } from "antd";
import {
    InfoCircleOutlined,
    WarningOutlined,
    StopOutlined,
    SwapOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    EditOutlined
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { Personnel } from "../../@types/Personnel";
import imageUtility from "../../utils/imageUtility";
import nameFormat from "../../utils/nameFormat";
import dayjs from "dayjs";
import personnelDutyLogsService from "../../services/personnelDutyLogsService";
import type { PersonnelDutyLogs } from "../../@types/personnelDutyLogs";
import { getDutyStatusColor } from "../../utils/getDutyStatusColor";

const { TextArea } = Input;

interface PersonnelStatusDutyModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    selectedPersonnel: Personnel | null;
    form: FormInstance;
    onAfterSave: () => void;
    onUpdate: (values: any) => Promise<void>;
}

const PersonnelDutyStatusModal: React.FC<PersonnelStatusDutyModalProps> = ({
    isModalVisible,
    setIsModalVisible,
    selectedPersonnel,
    form,
    onAfterSave,
}) => {
    const [currentSelectedStatus, setCurrentSelectedStatus] = useState<string | null>(null);

    // Helper to format duration for the Info Card
    const getDurationLabel = (start?: Date, end?: Date | null) => {
        if (!start) return "N/A";
        return `${dayjs(start).format("MMM D, YYYY")} — ${end ? dayjs(end).format("MMM D, YYYY") : "Present"}`;
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload: PersonnelDutyLogs = {
                personnelId: selectedPersonnel?.personnelId,
                status: values.status,
                remarks: values.remarks,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate ? values.endDate.toISOString() : null,
                isActive: true
            };

            await personnelDutyLogsService.add(payload);
            setIsModalVisible(false);
            form.resetFields();
            onAfterSave();
        } catch (error) {
            console.error("Validation failed");
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <EditOutlined className="text-blue-600" />
                    <span className="font-bold text-slate-700">Personnel Status Management</span>
                </Space>
            }
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleOk}
            centered
            width={720}
            okText="Apply Change"
            okButtonProps={{
                className: "rounded-lg px-8 font-semibold",
                danger: currentSelectedStatus === "Suspended" || currentSelectedStatus === "Inactive"
            }}
        >
            {/* 1. PERSONNEL INFO CARD WITH REMARKS & DURATION */}
            {selectedPersonnel && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <Image
                            width={60}
                            height={60}
                            className="rounded-xl object-cover shadow-sm border-2 border-white"
                            src={imageUtility.getProfile(selectedPersonnel.profile)}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="truncate mr-4">
                                    <div className="text-xl font-black text-slate-800 leading-tight">
                                        {nameFormat(selectedPersonnel)}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">
                                        SN: {selectedPersonnel.serialNumber || "N/A"}
                                    </div>
                                </div>
                                <Tag color={getDutyStatusColor(selectedPersonnel?.dutyStatus?.status)} className="m-0 border-none rounded-full px-3 text-[10px] font-bold">
                                    {selectedPersonnel.dutyStatus?.status?.toUpperCase() || "NO STATUS"}
                                </Tag>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-slate-200/60">
                                <div className="col-span-1">
                                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">Current Duration</div>
                                    <div className="text-[11px] text-slate-600 font-medium truncate">
                                        {getDurationLabel(selectedPersonnel.dutyStatus?.startDate, selectedPersonnel.dutyStatus?.endDate)}
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">Current Remarks</div>
                                    <div className="text-[11px] text-slate-500 italic truncate">
                                        {selectedPersonnel.dutyStatus?.remarks || "No record"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. DYNAMIC PROTOCOL ALERT */}
            <div className="mb-6">
                {currentSelectedStatus ? (
                    <Alert
                        showIcon
                        icon={statusIcons[currentSelectedStatus]}
                        message={<span className="font-bold text-xs uppercase">{currentSelectedStatus} Protocol</span>}
                        description={<span className="text-[11px]">{statusDescriptions[currentSelectedStatus]}</span>}
                        type={statusAlertTypes[currentSelectedStatus] as any}
                        className="rounded-xl border-none shadow-sm flex items-start"
                    />
                ) : (
                    <div className="py-3 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <span className="text-slate-400 text-xs italic">Select a new status to review administrative impact.</span>
                    </div>
                )}
            </div>

            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{ startDate: dayjs() }}
            >
                {/* 3. TAILWIND GRID: STATUS, START DATE, END DATE */}
                <div className="grid grid-cols-12 gap-x-4">
                    <div className="col-span-4">
                        <Form.Item
                            name="status"
                            label={<span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.1em]">New Duty Status</span>}
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select
                                size="large"
                                placeholder="Status"
                                onChange={(val) => setCurrentSelectedStatus(val)}
                                options={statusOptions}
                            />
                        </Form.Item>
                    </div>

                    <div className="col-span-4">
                        <Form.Item
                            name="startDate"
                            label={<span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.1em]">Effectivity Date</span>}
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <DatePicker 
                                size="large" 
                                className="w-full rounded-lg" 
                                placeholder="Start Date"
                            />
                        </Form.Item>
                    </div>

                    <div className="col-span-4">
                        <Form.Item
                            name="endDate"
                            label={<span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.1em]">End Date (Optional)</span>}
                        >
                            <DatePicker 
                                size="large" 
                                className="w-full rounded-lg" 
                                placeholder="End Date"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Divider className="my-2 border-slate-100" />

                {/* 4. JUSTIFICATION */}
                <Form.Item
                    name="remarks"
                    label={<span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.1em]">Official Remarks (Optional)</span>}
                >
                    <TextArea
                        rows={3}
                        placeholder="State the reason for this change..."
                        className="rounded-xl p-3 border-slate-200"
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// --- STATIC ASSETS ---

const statusOptions = [
    { value: 'Active', label: <span className="text-green-600">Active Duty</span> },
    { value: 'Restricted', label: <span className="text-orange-500">Restricted</span> },
    { value: 'Reassigned', label: <span className="text-blue-500">Reassigned</span> },
    { value: 'Suspended', label: <span className="text-red-500">Suspended</span> },
    { value: 'Inactive', label: <span className="text-slate-500">Inactive</span> },
];

const statusIcons: Record<string, React.ReactNode> = {
    Active: <CheckCircleOutlined />,
    Restricted: <InfoCircleOutlined />,
    Reassigned: <SwapOutlined />,
    Suspended: <StopOutlined />,
    Inactive: <WarningOutlined />,
};

const statusDescriptions: Record<string, string> = {
    Active: "Standard operational status. No restrictions applied.",
    Restricted: "Restricted to base quarters. Leave privileges deferred.",
    Reassigned: "Pending unit transfer. Command oversight remains active.",
    Suspended: "Immediate revocation of all duty privileges.",
    Inactive: "Personnel record will be moved to archives.",
};

const statusAlertTypes: Record<string, string> = {
    Active: "success", Restricted: "warning", Reassigned: "info", Suspended: "error", Inactive: "warning",
};

export default PersonnelDutyStatusModal;