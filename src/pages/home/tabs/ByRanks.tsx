import React, { useRef } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "../../../services/dashboardService";
import nameFormat from "../../../utils/nameFormat";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Personnel } from "../../../@types/Personnel";
import type { PersonnelActivity } from "../../../@types/PersonnelActivity";
import { formatDateToMilitary } from "../../../utils/formatDateToMilitary";

// ---------------- COMPONENT ----------------
const ByRanks: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch personnel with ongoing activities
  const { data: personnelData = [] } = useQuery({
    queryKey: ["personnelOnGoingActivities"],
    queryFn: async () => await dashboardService.getPersonnelOnGoingActivities(),
    initialData: [],
  });

  // ---------------- TABLE COLUMNS ----------------
  const columns: ColumnsType<Personnel> = [
    {
      title: "Nr",
      key: "nr",
      align: "center",
      width: 5,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      align: "center",
      render: (_, record) => <span>{nameFormat(record)}</span>,
    },
    {
      title: "Activity",
      align: "center",
      render: (_: any, record: any) => {
        if (
          !record.personnelActivities ||
          record.personnelActivities.length === 0
        ) {
          return (
            <span style={{ color: "#22c55e", fontWeight: 500 }}>DUTY</span>
          );
        }

        return (
          <span>
            {record.personnelActivities
              .map((a: PersonnelActivity) => a.activityType?.activityTypeName)
              .join(", ")}
          </span>
        );
      },
    },

    {
      title: "Title / Date",
      key: "titleAndDate",
      align: "center",
      render: (_, record) => (
        <div>
          {record.personnelActivities && record.personnelActivities.length > 0
            ? record.personnelActivities.map((a: PersonnelActivity) => (
                <div key={a.personnelActivityId}>
                  {
                    (a.endDate && a.startDate && (
                      <div className="grid grid-cols-1">
                        <strong>{a.title}</strong>{" "}
                        <span>
                          ({formatDateToMilitary(a.startDate)} -{" "}
                          {formatDateToMilitary(a.endDate)})
                        </span>
                      </div>
                    ))}
                </div>
              ))
            : ""}
        </div>
      ),
    },
  ];

  // ---------------- EXCEL EXPORT ----------------
  const handleExportExcel = () => {
    const excelData: any[] = [];
    personnelData.forEach((person) => {
      if (person.personnelActivities && person.personnelActivities.length > 0) {
        person.personnelActivities.forEach((activity) => {
          excelData.push({
            Personnel: nameFormat(person),
            ActivityType: activity.activityType?.activityTypeName ?? "",
            Title: activity.title ?? "",
            StartDate: activity.startDate
              ? formatDateToMilitary(activity.startDate)
              : "",
            EndDate: activity.endDate
              ? formatDateToMilitary(activity.endDate)
              : "",
          });
        });
      } else {
        excelData.push({
          Personnel: nameFormat(person),
          ActivityType: "",
          Title: "",
          StartDate: "",
          EndDate: "",
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personnel Activities");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "PersonnelActivities.xlsx");
  };

  // ---------------- PDF EXPORT ----------------
  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;

    doc.setFontSize(18);
    doc.setTextColor("#5B8FF9");
    doc.text("Personnel Activities Report", 40, y);
    y += 30;

    // Continuous counter for all rows
    let counter = 1;

    const body: (string | number)[][] = personnelData.flatMap((person) => {
      if (person.personnelActivities && person.personnelActivities.length > 0) {
        return person.personnelActivities.map((a) => [
          counter++, // Nr continuous across all rows
          nameFormat(person),
          a.activityType?.activityTypeName ?? "",
          a.title
            ? `${a.title} (${a.startDate ? formatDateToMilitary(a.startDate) : ""} - ${a.endDate ? formatDateToMilitary(a.endDate) : ""})`
            : "",
        ]);
      } else {
        return [
          [
            counter++, // still increment for personnel with no activity
            nameFormat(person),
            "",
            "",
          ],
        ];
      }
    });

    autoTable(doc, {
      startY: y,
      head: [["Nr", "Name", "Activity Type", "Title / Date"]],
      body,
      theme: "grid",
      headStyles: { fillColor: [91, 143, 249] },
      styles: { fontSize: 10 },
      margin: { left: 40, right: 40 },
      didDrawPage: (data) => {
        y = (data.cursor?.y ?? 0) + 20;
      },
    });

    doc.save("PersonnelActivities.pdf");
  };

  // ---------------- PRINT ----------------
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
 <title>Personnel by Activity Report ${new Date()}</title>
      <style>
      body { font-family: Arial; padding:20px }
      h1,h4 { text-align:center; color:#5B8FF9 }
      table { border-collapse:collapse; width:100% }
      th,td { border:1px solid black; padding:6px }
      </style>
      </head>
      <body>
      <h1>Activity Report (${formatDateToMilitary(new Date())})</h1>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button style={{ marginRight: 8 }} onClick={handlePrint}>
          Print
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={handleExportExcel}
        >
          Export Excel
        </Button>
        <Button type="primary" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </div>

      <div ref={printRef}>
        <Table
         scroll={{ x: 1000 }}
        size="small"
          columns={columns}
          dataSource={personnelData.map((p) => ({ ...p, key: p.personnelId }))}
          bordered
          pagination={false}
        />
      </div>
    </>
  );
};

export default ByRanks;
