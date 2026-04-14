import { useState, useRef } from "react";
import { Column } from "@ant-design/charts";
import { Table, Card, Button, Modal } from "antd";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "../../../services/dashboardService";
import nameFormat from "../../../utils/nameFormat";
import { convertUtcToPhDateShort } from "../../../utils/convertUtcToPhDateShort";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable";
import type { DepartmentActivityData } from "../../../@types/dashboardGraphs/DepartmentActivityData";
import autoTable from "jspdf-autotable";
import getRandomColor from "../../../utils/getRandomColor";
import type { Personnel } from "../../../@types/Personnel";

export default function DeptActivityChart() {
  const [modalVisible, setModalVisible] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: deptActivityData } = useQuery({
    queryKey: ["deptActivityData"],
    queryFn: async () =>
      await dashboardService.getPersonnelByDepartmentAndActivity(),
    initialData: [],
  });

  // Group by department
  const groupedData = deptActivityData.reduce(
    (acc, curr) => {
      if (!acc[curr.department]) acc[curr.department] = [];
      acc[curr.department].push(curr);
      return acc;
    },
    {} as Record<string, DepartmentActivityData[]>,
  );

  const config = {
    data: deptActivityData,
    isStack: true,
    xField: "department",
    yField: "personnel",
    seriesField: "activity",
    color: ["#5B8FF9", "#5AD8A6", "#F6BD16", "#E86452"],
    height: 300,
  };

  const columns = [
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Activity", dataIndex: "activity", key: "activity" },
    { title: "Personnel", dataIndex: "personnel", key: "personnel" },
  ];

  // --- Export to Excel ---
  const handleExportExcel = () => {
    const excelData: any[] = [];
    deptActivityData.forEach((dept) =>
      dept.names.forEach((personnel) => {
        if (personnel.personnelActivities?.length) {
          personnel.personnelActivities.forEach((act) => {
            excelData.push({
              Department: dept.department,
              Activity: dept.activity,
              Name: nameFormat(personnel),
              Title: act.title || "N/A",
              StartDate: act.startDate
                ? convertUtcToPhDateShort(act.startDate)
                : "",
              EndDate: act.endDate ? convertUtcToPhDateShort(act.endDate) : "",
            });
          });
        } else {
          excelData.push({
            Department: dept.department,
            Activity: dept.activity,
            Name: nameFormat(personnel),
            Title: "On Duty",
            StartDate: "",
            EndDate: "",
          });
        }
      }),
    );

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dept Activity");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "DeptActivity.xlsx");
  };

  // --- Print ---
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Department & Activity Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #5B8FF9; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 6px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Department & Activity Report</h1>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // --- Export PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Department & Activity Report", 105, 10, { align: "center" });
    let startY = 20;

    Object.entries(groupedData).forEach(([dept, activities]) => {
      doc.setFontSize(14);
      doc.setTextColor("#9254de");
      doc.text(dept, 10, startY);
      startY += 6;

      activities.forEach((act) => {
        doc.setFontSize(12);
        doc.setTextColor("#36cfc9");
        doc.text(act.activity, 12, startY);
        startY += 6;

        const rows: any[] = [];
        act.names.forEach((personnel) => {
          if (personnel.personnelActivities?.length) {
            personnel.personnelActivities.forEach((pa) => {
              rows.push([
                nameFormat(personnel),
                pa.title || "N/A",
                pa.startDate ? convertUtcToPhDateShort(pa.startDate) : "",
                pa.endDate ? convertUtcToPhDateShort(pa.endDate) : "",
              ]);
            });
          } else {
            rows.push([nameFormat(personnel), "", "", ""]);
          }
        });

        if (rows.length) {
          autoTable(doc, {
            startY,
            head: [["Name", "Title", "Start Date", "End Date"]],
            body: rows,
            theme: "grid",
            headStyles: { fillColor: [91, 143, 249] },
            margin: { left: 12, right: 12 },
          });
          startY = (doc as any).lastAutoTable.finalY + 10;
        }
      });
    });

    doc.save("DepartmentAndActivity.pdf");
  };

  const total = deptActivityData.reduce(
    (prev, curr) => prev + curr.personnel,
    0,
  );

  return (
    <Card
      title={
        <div className="py-3">
          <div className="flex justify-between">
            Personnel by Department & Activity Type ({total})
            <Button type="primary" onClick={() => setModalVisible(true)}>
              View All
            </Button>
          </div>
          <Button style={{ marginRight: 8 }} onClick={handlePrint}>
            Print
          </Button>
          <Button style={{ marginRight: 8 }} onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      }
    >
      <Column {...config} />
      <Table<DepartmentActivityData>
        size="small"
        columns={columns}
        dataSource={deptActivityData}
        pagination={false}
        rowKey={(record) => record.department + record.activity}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={`Personnel by Department & Activity (${total})`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1500}
      >
        <div className="flex justify-end">
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={handlePrint}
          >
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
        <div ref={printRef}>
          {Object.entries(groupedData).map(([dept, activities]) => {
            const deptColor = getRandomColor();

            return (
              <div key={dept} style={{ marginBottom: 24 }}>
                {/* Department Header */}
                <div
                  style={{
                    backgroundColor: deptColor,
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {dept} (
                  {activities.reduce((total, act) => total + act.personnel, 0)})
                </div>

                {/* Activities Grid */}
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                  {activities.map((act) => {
                    const actColor = getRandomColor();

                    const columns = [
                      {
                        title: "#",
                        render: (_: any, __: any, index: number) => index + 1,
                        width: 50,
                      },
                      {
                        title: "Personnel",
                        dataIndex: "name",
                        render: (_: any, record: Personnel) =>
                          nameFormat(record),
                      },
                      {
                        title: "Details",
                        render: (record: any) => {
                          if (!record.personnelActivities?.length) {
                            return (
                              <span style={{ color: "#10b981" }}>On Duty</span>
                            );
                          }

                          return record.personnelActivities.map(
                            (pa: any, i: number) => (
                              <div key={i}>
                                <strong>{pa.title}</strong>
                                <div style={{ fontSize: 12 }}>
                                  {pa.startDate && pa.endDate
                                    ? `${convertUtcToPhDateShort(pa.startDate)} - ${convertUtcToPhDateShort(pa.endDate)}`
                                    : ""}
                                </div>
                              </div>
                            ),
                          );
                        },
                      },
                    ];

                    return (
                      <div key={act.activity}>
                        {/* Activity Header */}
                        <div
                          style={{
                            backgroundColor: actColor,
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "6px 6px 0 0",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {act.activity} ({act.personnel})
                        </div>

                        {/* Table */}
                        <Table
                          columns={columns}
                          dataSource={act.names}
                          pagination={false}
                          size="small"
                          bordered
                          rowKey={(_, index) => index!.toString()}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </Card>
  );
}
