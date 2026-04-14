import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import personelService from "../../services/personelService";
import type { EnlistedPersonnelETE } from "../../@types/nonTable/EnlistedPersonnelETE";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import { useState } from "react";

// Excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ReEnlistModal from "./ReEnlistModal";
import SubmitStatusModal from "./SubmitStatusModal";
import DebounceInput from "../../componets/DebounceInput";

// ---------------- STATUS TAG ----------------
export const getStatusTag = (status?: string, daysLeft?: number) => {
  switch (status) {
    case "ALREADY SUBMITTED":
      return <Tag color="blue">ALREADY SUBMITTED</Tag>;
    case "ACTIVE":
      return <Tag color="green">ACTIVE</Tag>;
    case "NEAR ETE":
      return <Tag color="gold">NEAR ETE ({daysLeft} day/s)</Tag>;
    case "CRITICAL":
      return <Tag color="volcano">CRITICAL ({daysLeft} day/s)</Tag>;
    case "EXPIRED":
      return <Tag color="red">EXPIRED</Tag>;
    default:
      return <Tag>UNKNOWN</Tag>;
  }
};

const getStatus = (status?: string, daysLeft?: number) => {
  switch (status) {
    case "NEAR ETE":
      return `NEAR ETE (${daysLeft} day/s)`;
    case "CRITICAL":
      return `CRITICAL (${daysLeft} day/s)`;
    case "NO RECORD":
      return "-";
    default:
      return status;
  }
};

export default function EtePage() {
  const [enlistModal, setEnlistModal] = useState(false);
  const [submitStatusModal, setSubmitStatusModal] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<EnlistedPersonnelETE | null>(null);

  const [filteredData, setFilteredData] = useState<EnlistedPersonnelETE[]>([]);

  const {
    data = [],
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["enlistment-ete"],
    queryFn: async () => await personelService.getEnlistmentETE(),
  });


  const handleSubmitted = (record: EnlistedPersonnelETE) => {
    setSubmitStatusModal(true);
    setSelectedRecord(record);
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns: ColumnsType<EnlistedPersonnelETE> = [
    {
      title: "#",
      align: "center",
      width: 40,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      width: 300,
      render: (_, record) => nameFormat(record),
    },
    {
      title: "DATE ENTERED SVC",
      align: "center",
      dataIndex: "dateEnteredService",
      render: (value) => formatDateToMilitary(value),
    },
    {
      title: "YEAR/S IN SVC",
      align: "center",
      width: 100,
      dataIndex: "yearsInService",
    },
    {
      title: "DATE OF ENLISTMENT",
      align: "center",
      dataIndex: "dateEnlisted",
      render: (value) => formatDateToMilitary(value),
    },
    {
      title: "LATEST RE-ENLISTMENT",
      align: "center",
      dataIndex: "dateOfLatestReEnlistment",
      render: (value) => formatDateToMilitary(value),
    },
    {
      title: "NEXT ETE",
      align: "center",
      dataIndex: "nextETE",
      render: (date) => (date ? formatDateToMilitary(date) : "-"),
    },
    {
      title: "REMARKS",
      dataIndex: "remarks",
      width:150,
      render: (value, record) => getStatusTag(value, record.eteDaysRemaining),
    },
    {
      title: "ACTION",
      render: (_, record) => {
        if (record.remarks === "NO RECORD") return null;

        return (
          <>
            {record.remarks !== "ALREADY SUBMITTED" && (
              <Button
                size="small"
                type="link"
                onClick={() => handleSubmitted(record)}
              >
                Submit
              </Button>
            )}
          </>
        );
      },
    },
  ];

  // ---------------- PRINT ----------------
  const generatePrintHTML = () => {
    const rows = data.map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${nameFormat(item)}</td>
        <td>${formatDateToMilitary(item.dateEnteredService)}</td>
        <td>${item.yearsInService ?? "-"}</td>
        <td>${formatDateToMilitary(item.dateEnlisted)}</td>
        <td>${formatDateToMilitary(item.dateOfLatestReEnlistment)}</td>
        <td>${formatDateToMilitary(item.nextETE)}</td>
        <td>${getStatus(item.remarks, item.eteDaysRemaining)}</td>
      </tr>
    `,
    );

    return `
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Date Entered</th>
            <th>Years</th>
            <th>Enlistment</th>
            <th>Re-Enlistment</th>
            <th>Next ETE</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>ETE Report</title>
        <style>
         @page {
          size: landscape;
          margin: 8mm;
        }

          body { font-family: Arial; padding:20px }
          h1 { text-align:center; }
          table { border-collapse:collapse; width:100% }
          th,td { border:1px solid black; padding:6px; text-align:center }
        </style>
      </head>
      <body>
        <h1>ETE REPORT (${formatDateToMilitary(new Date())})</h1>
        ${generatePrintHTML()}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // ---------------- EXCEL ----------------
  const handleExportExcel = () => {
    const excelData = data.map((item, index) => ({
      No: index + 1,
      Name: nameFormat(item),
      DateEntered: formatDateToMilitary(item.dateEnteredService),
      YearsService: item.yearsInService,
      Enlistment: formatDateToMilitary(item.dateEnlisted),
      ReEnlistment: formatDateToMilitary(item.dateOfLatestReEnlistment),
      NextETE: formatDateToMilitary(item.nextETE),
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "ETE");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer]),
      `ETE Report (${formatDateToMilitary(new Date())}).xlsx`,
    );
  };

  // ---------------- PDF ----------------
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text(`ETE REPORT (${formatDateToMilitary(new Date())})`, 14, 15);

    const body: any = data.map((item, index) => [
      index + 1,
      nameFormat(item),
      formatDateToMilitary(item.dateEnteredService),
      item.yearsInService ?? "-",
      formatDateToMilitary(item.dateOfLatestReEnlistment),
      formatDateToMilitary(item.nextETE),
      getStatus(item.remarks, item.eteDaysRemaining),
    ]);

    autoTable(doc, {
      head: [
        [
          "No.",
          "Name",
          "Date Entered",
          "Years",
          "Re-Enlistment",
          "Next ETE",
          "Remarks",
        ],
      ],
      body,
      startY: 20,
    });

    doc.save(`ETE Report (${formatDateToMilitary(new Date())}).pdf`);
  };

  if (isError) return <div>Error loading data</div>;

  return (
    <>
      <div className="flex gap-2 mb-4"></div>
      <SubmitStatusModal
        setIsModalVisible={setSubmitStatusModal}
        selectedRecord={selectedRecord}
        isModalVisible={submitStatusModal}
        onAfterSave={() => {
          refetch();
          setSubmitStatusModal(false);
        }}
      />

      <ReEnlistModal
        setIsModalVisible={setEnlistModal}
        selectedRecord={selectedRecord}
        isModalVisible={enlistModal}
        onAfterSave={() => {}}
      />

      {/* ACTION BUTTONS */}
      <div className="flex justify-end mb-4 gap-1">
        <DebounceInput
          placeholder="Search Name..."
          style={{ width: 250 }}
          onChange={(value) => {
            const keyword = value.toLowerCase();

            if (!keyword) {
              setFilteredData(data);
              return;
            }

            const result = data.filter((item) =>
              nameFormat(item).toLowerCase().includes(keyword),
            );

            setFilteredData(result);
          }}
        />
        <Button onClick={handlePrint}>Print</Button>
        <Button onClick={handleExportExcel}>Excel</Button>
        <Button type="primary" onClick={handleExportPDF}>
          PDF
        </Button>
      </div>

      {/* TABLE */}
      <Table
        sticky
        scroll={{ x: 1000 }}
        loading={isFetching}
        rowKey={(record) => record.personnelId ?? 0}
        columns={columns}
        dataSource={filteredData.length > 0 ? filteredData : data}
        size="small"
        pagination={false}
        bordered
      />
    </>
  );
}
