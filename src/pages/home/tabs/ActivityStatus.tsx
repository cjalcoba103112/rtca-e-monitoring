import { Button, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { convertUtcToPhDateShort } from "../../../utils/convertUtcToPhDateShort";
import nameFormat from "../../../utils/nameFormat";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "../../../services/dashboardService";

// Excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { NameDTO } from "../../../@types/dashboardGraphs/ActivityData";
import { formatDateToMilitary } from "../../../utils/formatDateToMilitary";
import getRandomColor from "../../../utils/getRandomColor";

function ActivityStatus() {
  const printRef = useRef<HTMLDivElement>(null);

  const { data: personnelActivityData, isLoading } = useQuery({
    queryKey: ["personnelActivityData"],
    queryFn: async () => await dashboardService.getPersonnelByActivityType(),
    initialData: [],
    refetchInterval:30000,
  });

  // ---------------- TABLE COLUMNS ----------------

  const columns = (activity: string): ColumnsType<NameDTO> => [
    {
      title: "Nr",
      key: "nr",
      align: "center",
      width: 5,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      render: (record: NameDTO) => nameFormat(record.name),
      align: "center",
    },

    {
      title: "Title / Duration",
      align: "center",
      render: (record) => {
        if (activity.toLowerCase() === "on duty") return "";

        if (!record.startDate || !record.endDate) return record.title;

        return (
          <div className="grid grid-cols-1">
            <strong>{record.title}</strong>
            <div>
              {convertUtcToPhDateShort(record.startDate)} -
              {convertUtcToPhDateShort(record.endDate)}
            </div>
          </div>
        );
      },
    },
  ];

  const getColumns = (activity: string) => {
    if (activity == "On duty")
      return columns(activity).filter((c) => c.title != "Title / Duration");
    return columns(activity);
  };

  // ---------------- EXCEL EXPORT ----------------

  const handleExportExcel = () => {
    const excelData: any[] = [];

    personnelActivityData.forEach((activity) => {
      activity.info.forEach((info) => {
        excelData.push({
          Activity: activity.activity,
          Personnel: nameFormat(info.name),
          Title: info.title ?? "",
          SerialNumber: info.name.serialNumber,
          StartDate: info.startDate
            ? convertUtcToPhDateShort(info.startDate)
            : "",
          EndDate: info.endDate ? convertUtcToPhDateShort(info.endDate) : "",
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "ActivityData.xlsx");
  };

  // ---------------- PDF EXPORT ----------------

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    let y = 40;

    doc.setFontSize(18);
    doc.setTextColor("#5B8FF9");
    doc.text("Personnel by Activity Report", 40, y);

    y += 30;

    personnelActivityData.forEach((activity) => {
      doc.setFontSize(14);
      doc.setTextColor("#5B8FF9");

      doc.text(`${activity.activity} (${activity.personnel})`, 40, y);

      y += 10;

      const body = activity.info.map((info, i) => [
        i + 1,
        info.name.rank?.rankCode ?? "",
        info.name.lastName ?? "",
        info.name.firstName ?? "",
        info.name.middleName?.charAt(0) ?? "",
        info.name.serialNumber ?? "",
        activity.activity.toLowerCase() === "on duty" ? "" : (info.title ?? ""),
        info.startDate ? convertUtcToPhDateShort(info.startDate) : "",
        info.endDate ? convertUtcToPhDateShort(info.endDate) : "",
      ]);

      autoTable(doc, {
        startY: y,
        head: [
          [
            "#",
            "Rank",
            "Lastname",
            "Firstname",
            "MI",
            "Serial",
            "Title",
            "Start",
            "End",
          ],
        ],
        body,
        theme: "grid",
        headStyles: { fillColor: [91, 143, 249] },
        styles: { fontSize: 10 },
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          y = (data.cursor?.y ?? 0) + 20;
        },
      });

      if (y > doc.internal.pageSize.height - 100) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save("ActivityData.pdf");
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

      <Spin spinning={isLoading}>
        <div ref={printRef}>
          <div className="grid md:grid-cols-1 text-center sm:grid-cols-1 gap-4">
            {personnelActivityData.map((activity, index) => {
              return (
                <Table
                  scroll={{ x: 400 }}
                  size="small"
                  key={activity.activity}
                  rowKey={(record) => record.name.personnelId ?? 0}
                  columns={getColumns(activity.activity)}
                  dataSource={[...activity.info].sort(
                    (a, b) =>
                      (a.name?.rank?.rankLevel ?? 0) -
                      (b.name?.rank?.rankLevel ?? 0),
                  )}
                  pagination={false}
                  bordered
                  showHeader={false}
                  title={() => (
                    <div
                      style={{
                        background: getRandomColor(index),
                        padding: "8px",
                        fontWeight: "bold",
                        textAlign: "center",
                        borderRadius: "6px",
                      }}
                    >
                      {activity.activity} ({activity.personnel})
                    </div>
                  )}
                />
              );
            })}
          </div>
        </div>
      </Spin>
    </>
  );
}

export default ActivityStatus;
