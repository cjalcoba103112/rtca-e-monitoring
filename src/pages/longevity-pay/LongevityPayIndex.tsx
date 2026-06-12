// LongevityPayIndex.tsx
import { useState } from "react";
import {
    Table,
    Button,
    Form,
    Space,
    Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { LongevityPay } from "../../@types/LongevityPay";
import { useQuery } from "@tanstack/react-query";
import longevityPayService from "../../services/longevityPayService";
import LongevityPaySaveModal from "./LongevityPaySaveModal";

export default function LongevityPayIndex() {
    const [selectedLongevityPay, setSelectedLongevityPay] =
        useState<LongevityPay | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const {
        data: longevityPays,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["longevityPays"],
        queryFn: async () => await longevityPayService.getAll(),
    });

    const [form] = Form.useForm<LongevityPay>();

    const openModal = (longevityPay?: LongevityPay) => {
        if (longevityPay) {
            form.setFieldsValue(longevityPay);
            setSelectedLongevityPay(longevityPay);
        } else {
            form.resetFields();
            setSelectedLongevityPay(null);
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (id?: number) => {
        await longevityPayService.delete(id);
        refetch();
    };

    const columns: ColumnsType<LongevityPay> = [
        {
            title: "Years Of Service",
            dataIndex: "yearsOfService",
            key: "yearsOfService",
            render: (value) => `${value} years`,
            align: "center"
        },
        {
            title: "Percentage",
            dataIndex: "percentage",
            key: "percentage",
            align: "center",
            render: (value) => `${value} %`
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={() => handleDelete(record.id ?? undefined)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Button type="primary" onClick={() => openModal()}>
                Add Longevity Pay
            </Button>

            <Table
                scroll={{ x: 1000 }}
                columns={columns}
                dataSource={longevityPays}
                size="small"
                rowKey="id"
                loading={isFetching}
            />

            <LongevityPaySaveModal
                form={form}
                setIsModalVisible={setIsModalVisible}
                selectedLongevityPay={selectedLongevityPay}
                isModalVisible={isModalVisible}
                onAfterSave={refetch}
            />
        </div>
    );
};
