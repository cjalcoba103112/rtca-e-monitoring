import React, { useRef, useState } from "react";
import {
    Table,
    Button,
    Space,
    Popconfirm,
    Form,
    Tooltip,
    Image,
    Dropdown,
    type MenuProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Personnel } from "../../@types/Personnel";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import dayjs, { Dayjs } from "dayjs";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import DebounceInput from "../../componets/DebounceInput";

import {
    EditOutlined,
    DeleteOutlined,
    HistoryOutlined,
    UserOutlined,
    UserAddOutlined,
    CheckOutlined,
    CloseOutlined,
    DownloadOutlined,
    PrinterOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
} from "@ant-design/icons";
import imageUtility from "../../utils/imageUtility";
import PersonnelActivitiesTable from "../leave-history/PersonnelActivitiesTable";
import type { Usertbl } from "../../@types/Usertbl";
import departmentService from "../../services/departmentService";

// Export Utilities
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import nameFormat from "../../utils/nameFormat";
import type { Rank } from "../../@types/Rank";
import formattedPeso, { formattedPesoNoSign } from "../../utils/formattedPeso";
import longevityPayService from "../../services/longevityPayService";
import type { PersonnelLongevityPay } from "../../@types/nonTable/PersonnelLongevityPay";
import { usePrint } from "../../hooks/documents/usePrint";

export type PersonnelForm = Omit<
    Personnel,
    "dateEnlisted" | "dateEnteredService" | "dateOfLastPromotion"
> & {
    dateEnlisted?: Dayjs | null;
    dateEnteredService?: Dayjs | null;
    dateOfLastPromotion?: Dayjs | null;
};

export const emptyPersonnel: Personnel = {
    personnelId: null,
    profile: null,
    serialNumber: null,
    firstName: null,
    middleName: null,
    lastName: null,
    rankId: null,
    rank: null,
    email: null,
    employmentStatus: "Active",
    dateEnlisted: null,
    dateEnteredService: null,
    dateOfLastPromotion: null,
    personnelActivities: [],
};

export default function PersonnelLongevityPayIndex() {
     const ref = useRef<HTMLDivElement | null>(null);

  const { handlePrint } = usePrint({ ref,orientation:'landscape' });
    const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
        null,
    );
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState<PersonnelLongevityPay[]>([]);
    const [leaveHistoryModal, setLeaveHistoryModal] = useState<boolean>(false);
    const [form] = Form.useForm<PersonnelForm>();
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [userForm] = Form.useForm<Usertbl>();
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [statusForm] = Form.useForm();

    const { data: departments } = useQuery({
        queryKey: ["departments"],
        queryFn: async () => await departmentService.getAll(),
    });

    const {
        data: personnelList,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["personnelLongevityPays"],
        queryFn: async () => {
            const data = await personelService.getLongevityPay();
            setFilteredData(data);
            return data;
        },
        initialData: [],
    });

    const {
        data: longevityPays,

    } = useQuery({
        queryKey: ["longevityPays"],
        queryFn: async () => {
            return await longevityPayService.getAll();
        },
        initialData: [],
    });

    // Current dataset active in view
    const currentData = filteredData.length ? filteredData : personnelList;

    // Helper to format designation column string safely for downloads and prints
    const getDesignationString = (record: Personnel) => {
        const primaryDeptName = record.department?.departmentName || "";
        const hasOtherDepts = record.otherDepartmentIds && record.otherDepartmentIds.length > 0;
        const otherDeptNames = hasOtherDepts
            ? departments
                ?.filter((dept) => record.otherDepartmentIds?.includes(dept.departmentId ?? 0))
                ?.map((dept) => dept.departmentName)
                ?.join(", ")
            : "";

        if (!primaryDeptName && !otherDeptNames) return "";
        if (primaryDeptName && otherDeptNames) return `${primaryDeptName} (Other: ${otherDeptNames})`;
        return primaryDeptName || otherDeptNames || "";
    };

    // --- EXPORT FUNCTIONALITIES ---

const exportToExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const excelData = currentData.map((item, index) => ({
        "Nr": index + 1,
        "Name": nameFormat(item),
        "Date Entered Service": item.dateEnteredService ? formatDateToMilitary(item.dateEnteredService) : "",
        "Years of Service": item.yearsOfService ?? 0,
        "Base Pay": item.rank?.basePay ?? 0,
        "Longevity %": item.percentage ? `${item.percentage}%` : "0%",
        "Longevity Pay Amount": item.longevityPay ?? 0,
        "Total Gross Pay": item.totalAmount ?? 0
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { 'Personnel': ws }, SheetNames: ['Personnel'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `Personnel_Longevity_Pay_Report_${dayjs().format("YYYY-MM-DD")}${fileExtension}`);
};
const exportToPDF = () => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    doc.setFontSize(16);
    doc.text("Personnel Longevity Pay Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`, 14, 22);

    // Completely matched to match the Excel column header layout
    const tableColumn = [
        "Nr",
        "Name",
        "Date Entered Service",
        "Years of Service",
        "Base Pay",
        "Longevity %",
        "Longevity Pay Amount",
        "Total Gross Pay"
    ];

    // Re-mapped fields using your data types and formatted curriencies matching the UI 
    const tableRows = currentData.map((item, index) => [
        index + 1,
        nameFormat(item),
        item.dateEnteredService ? formatDateToMilitary(item.dateEnteredService) : "",
        item.yearsOfService ?? 0,
        formattedPesoNoSign(item.rank?.basePay ?? 0),
        `${item.percentage ?? 0}%`,
        formattedPeso(item.longevityPay ?? 0),
        formattedPeso(item.totalAmount ?? 0)
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 28,
        theme: "striped",
        styles: { fontSize: 9, overflow: "linebreak" },
        // Column adjustments to give currency and names maximum landscape space
        columnStyles: {
            0: { cellWidth: 12, halign: "center" },  // Nr
            1: { cellWidth: 50 },                     // Name
            2: { cellWidth: 38, halign: "center" },  // Date Entered Service
            3: { cellWidth: 28, halign: "center" },  // Years of Service
            4: { cellWidth: 35, halign: "right" },   // Base Pay
            5: { cellWidth: 25, halign: "center" },  // Longevity %
            6: { cellWidth: 38, halign: "right" },   // Longevity Pay Amount
            7: { cellWidth: 40, halign: "right" }    // Total Gross Pay
        }
    });

    doc.save(`Personnel_Longevity_Pay_Report_${dayjs().format("YYYY-MM-DD")}.pdf`);
};

    

    const exportMenuItems: MenuProps["items"] = [
        {
            key: "excel",
            label: "Export to Excel",
            icon: <FileExcelOutlined className="text-green-600" />,
            onClick: exportToExcel,
        },
        {
            key: "pdf",
            label: "Export to PDF",
            icon: <FilePdfOutlined className="text-red-500" />,
            onClick: exportToPDF,
        },
        {
            key: "print",
            label: "Print Table",
            icon: <PrinterOutlined className="text-blue-500" />,
            onClick: ()=>handlePrint(),
        },
    ];

    const openModal = (personnel?: Personnel) => {
        if (personnel) {
            form.setFieldsValue({
                ...personnel,
                dateEnlisted: personnel.dateEnlisted ? dayjs(personnel.dateEnlisted) : null,
                dateEnteredService: personnel.dateEnteredService ? dayjs(personnel.dateEnteredService) : null,
                dateOfLastPromotion: personnel.dateOfLastPromotion ? dayjs(personnel.dateOfLastPromotion) : null,
            });
            setSelectedPersonnel(personnel);
        } else {
            form.setFieldsValue(emptyPersonnel);
            setSelectedPersonnel(null);
        }
        setIsModalVisible(true);
    };

 

   const columns: ColumnsType<PersonnelLongevityPay> = [
    {
        title: "Nr",
        width: 45,
        render: (_, __, index) => index + 1,
    },
    {
        title: "",
        key: "profile",
        dataIndex: "profile",
        width: 120,
        render: (value) => (
            <div style={{ cursor: "pointer" }}>
                <Image
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                    src={imageUtility.getProfile(value)}
                    fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    placeholder={
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <UserOutlined style={{ fontSize: 24, color: "#bfbfbf" }} />
                        </div>
                    }
                    preview={{
                        mask: <div style={{ fontSize: 12 }}>View</div>,
                    }}
                />
            </div>
        ),
    },
    {
        title: "Name",
        dataIndex: "lastName",
        key: "lastname",
        ellipsis: true,
        // Typings match your new type contract
        render: (_, record: PersonnelLongevityPay) => nameFormat(record), 
    },
    {
        title: "Date Entered Service",
        dataIndex: "dateEnteredService",
        key: "dateEnteredService",
        render: (value) => (value ? formatDateToMilitary(value) : ""),
    },
    {
        title: "Years of Service",
        dataIndex: "yearsOfService",
        key: "yearsOfService",
        width: 140,
        align: "center",
        // Safely fallback to 0 if null
        render: (value) => value ?? 0, 
    },
    {
        title: "Base Pay",
        dataIndex: "rank",
        key: "basePay",
        render: (rank) => formattedPeso(rank?.basePay ?? 0),
    },
    {
        title: "Longevity %",
        dataIndex: "percentage",
        key: "longevityPercentage",
        align: "center",
        render: (value) => `${value ?? 0}%`,
    },
    {
        title: "Longevity Pay Amount",
        dataIndex: "longevityPay",
        key: "longevityPayAmount",
        render: (value) => formattedPeso(value ?? 0),
    },
    {
        title: "Total Gross Pay",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (value) => <strong>{formattedPeso(value ?? 0)}</strong>,
    }
];
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Space size="middle">
                    <Button type="primary" onClick={() => openModal()}>
                        Add Personnel
                    </Button>

                    <Dropdown menu={{ items: exportMenuItems }} placement="bottomLeft">
                        <Button icon={<DownloadOutlined />}>
                            Export / Print
                        </Button>
                    </Dropdown>
                </Space>

                <DebounceInput
                    placeholder="Search Name..."
                    style={{ width: 250 }}
                    onChange={(value) => {
                        const keyword = value.toLowerCase().trim();

                        if (!keyword) {
                            setFilteredData(personnelList);
                            return;
                        }

                        const result = personnelList.filter((item) => {
                            const name = nameFormat(item || {}).toLowerCase();
                            return name.includes(keyword);
                        });

                        setFilteredData(result);
                    }}
                />
            </div>
<div ref={ref}>
<Table<PersonnelLongevityPay>
                
                sticky
                scroll={{ x: "max-content" }}
                pagination={false}
                size="small"
                columns={columns}
                dataSource={currentData}
                rowKey="personnelId"
                loading={isFetching}
                
            />
</div>
            

        </div>
    );
};