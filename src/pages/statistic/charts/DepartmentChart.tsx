import { useState, useRef } from "react";
import { Pie } from "@ant-design/charts";
import { Table, Card, Button, Modal } from "antd";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "../../../services/dashboardService";
import type { DepartmentData } from "../../../@types/dashboardGraphs/DepartmentData";
import nameFormat from "../../../utils/nameFormat";

// Excel libraries
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getRandomColor from "../../../utils/getRandomColor";
import type { Personnel } from "../../../@types/Personnel";

export default function DepartmentChart() {
  const [modalVisible, setModalVisible] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: departmentData } = useQuery({
    queryKey: ["departmentData"],
    queryFn: async () => await dashboardService.getPersonnelByDepartment(),
    initialData: [],
  });

  const config = {
    data: departmentData,
    angleField: "personnel",
    colorField: "department",
    radius: 0.8,
    label: {
    text: "personnel",
    position: "outside",
  },
    height: 300,
  };

  const columns = [
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Personnel", dataIndex: "personnel", key: "personnel" },
  ];

  // ----------------- Excel Export -----------------
  const handleExportExcel = () => {
    const excelData: any[] = [];
    departmentData.forEach((dept) => {
      dept.names.forEach((name) => {
        excelData.push({
          Department: dept.department,
          Personnel: nameFormat(name),
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Department Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DepartmentData.xlsx");
  };

  // ----------------- PDF Export -----------------
  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;

    doc.setFontSize(18);
    doc.setTextColor("#36cfc9");
    doc.text("Personnel by Department Report", 40, y);
    y += 30;

    departmentData.forEach((dept) => {
      doc.setFontSize(14);
      doc.setTextColor("#36cfc9");
      doc.text(`${dept.department} (${dept.personnel})`, 40, y);
      y += 10;

      // Prepare table body with activity type and title
      const body = dept.names.map((name, i) => {
        // If no activities, show "On Duty"
        if (
          !name.personnelActivities ||
          name.personnelActivities.length === 0
        ) {
          return [i + 1, nameFormat(name), "On Duty"];
        }

        // Otherwise, combine activityTypeName + title
        const activitiesText = name.personnelActivities
          .map(
            (act) =>
              `${act.activityType?.activityTypeName ?? "No Type"} (${act.title ?? ""})`,
          )
          .join(", "); // join multiple activities with comma

        return [i + 1, nameFormat(name), activitiesText];
      });

      autoTable(doc, {
        startY: y,
        head: [["#", "Personnel", "Activity"]],
        body,
        theme: "grid",
        headStyles: { fillColor: [54, 207, 201] },
        styles: { fontSize: 10 },
        margin: { left: 40, right: 40 },
        tableWidth: "auto",
        didDrawPage: (data) => {
          y = (data?.cursor?.y ?? 0) + 20;
        },
      });

      if (y > doc.internal.pageSize.height - 100) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save("DepartmentData.pdf");
  };
  // ----------------- Print -----------------
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Personnel by Department</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #36cfc9; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: left; }
            h2 { color: #36cfc9; }
          </style>
        </head>
        <body>
          <h1>Personnel by Department Report</h1>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const total = departmentData.reduce((prev, curr) => prev + curr.personnel, 0);

  return (
    <Card
      title={
        <div className="py-3">
          <div className="flex justify-between">
            Personnel by Department ({total})
            <Button type="primary" onClick={() => setModalVisible(true)}>
              View All
            </Button>
          </div>
          <Button style={{ marginRight: 8 }} onClick={handlePrint}>
            Print
          </Button>
          <Button style={{ marginRight: 8 }} onClick={handleExportExcel}>
            Export to Excel
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handleExportPDF}
          >
            Export to PDF
          </Button>
        </div>
      }
    >
      <Pie {...config} />
      <Table<DepartmentData>
        size="small"
        columns={columns}
        dataSource={departmentData}
        pagination={false}
        rowKey={(record) => record.department ?? ""}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={`Personnel by Department (${total})`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1500}
      >
        <div className="flex justify-end">
          <Button style={{ marginRight: 8 }} onClick={handlePrint}>
            Print
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handleExportExcel}
          >
            Export to Excel
          </Button>
          <Button type="primary" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </div>
        <div
          ref={printRef}
          className="grid md:grid-cols-2 sm:grid-cols-1 gap-3"
        >
          {departmentData.map((dept) => {
            const headerColor = getRandomColor();

            const columns:any = [
              {
                title: "#",
                render: (_: any, __: any, index: number) => index + 1,
                width: 40,
              },
              {
                title: "Personnel",
                dataIndex: "names",
                render: (_: any,record:Personnel) => nameFormat(record),
              },
              {
                title: "Status / Activity",
                align:"center",
                render: (record: any) => {
                  if (!record.personnelActivities?.length) {
                    return <span style={{ color: "#10b981" }}>On Duty</span>;
                  }

                  return record.personnelActivities.map(
                    (act: any, i: number) => (
                      <div key={i}>
                        <strong>{act.title}</strong>
                        <div>{act.activityType?.activityTypeName}</div>
                      </div>
                    ),
                  );
                },
              },
            ];

            return (
              <div key={dept?.department}>
                <div
                  style={{
                    backgroundColor: headerColor,
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px 6px 0 0",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {dept?.department} ({dept?.personnel})
                </div>

                <Table<any>
                  sticky
                  columns={columns}
                  dataSource={dept.names}
                  pagination={false}
                  size="small"
                  bordered
                  rowKey={(_, index) => index!.toString()}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </Card>
  );
}
