import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Input,
  Button,
  Upload,
  Alert,
  Tag,
  Space,
  Typography,
  Divider,
  Spin,
  Avatar,
  message,
  Empty,
} from "antd";
import {
  WarningOutlined,
  UserOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import emailEteCommunicationService from "../../services/emailEteCommunicationService";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import { formatDaysToYMD } from "../../utils/formatDaysToYMD";
import imageUtility from "../../utils/imageUtility";
import type { EnlistedPersonnelETE } from "../../@types/nonTable/EnlistedPersonnelETE";

const { Title, Text, Paragraph } = Typography;

type EteExplanationProps = {
  selectedEte?: EnlistedPersonnelETE | null;
};

export default function EteExplanationIndex({
  selectedEte,
}: EteExplanationProps) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const { token } = useParams<{ token: string }>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: explanation, isFetching } = useQuery({
    queryKey: ["explanation", token, selectedEte],
    queryFn: async () => {
      if (selectedEte) {
        const ete = await emailEteCommunicationService.getByPersonnelId(
          selectedEte?.personnelId ?? 0,
          selectedEte.nextETE,
        );
        setPreviewUrl(imageUtility.getFileWithBaseUrl(ete.supportingDocument));
        return ete;
      }

      const ete = await emailEteCommunicationService.getbyToken(token ?? "");
      setPreviewUrl(imageUtility.getFileWithBaseUrl(ete.supportingDocument));

      return ete;
    },
    enabled: true,
  });

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const file = fileList[0]?.originFileObj;
      await emailEteCommunicationService.updateByToken(token!, "", file);
      message.success("Submitted successfully!");
      setFileList([]);
    } catch (error: any) {
      message.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    const lastFile = fileList.slice(-1);
    const fileObj = lastFile[0]?.originFileObj;

    if (fileObj && fileObj.type === "application/pdf") {
      setFileList(lastFile);
      const url = URL.createObjectURL(fileObj);
      setPreviewUrl(url);
    } else {
      setFileList([]);
      setPreviewUrl(null);
    }
  };

  const handleDownloadFormat = () => {
    const link = document.createElement("a");
    link.href = "/EXPLANATION_LETTER_FORMAT.docx";
    link.download = "ETE_Explanation_Template.docx";
    link.click();
    message.info("Downloading template...");
  };

  const isCritical = (explanation?.remainingDays ?? 0) < 330;

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" tip="Loading compliance data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-4">
      <div className="mx-auto max-w-7xl">
        <Title level={3} className="mb-6">
          ETE Compliance Portal
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          {!selectedEte && (
            <Alert
              message="Immediate Action Required"
              description={`You are currently ${formatDaysToYMD(explanation?.remainingDays)} before your ETE. Administrative regulations require document finalization 11 months prior.`}
              type="error"
              showIcon
              icon={<WarningOutlined />}
              className="shadow-sm"
            />
          )}

          <div className={`grid grid-cols-1 gap-6 lg:grid-cols-4`}>
            {/* LEFT COLUMN */}
            <div className="lg:col-span-1">
              <Space direction="vertical" className="w-full" size="middle">
                <Card bordered={false} className="shadow-sm">
                  <div className="mb-5 text-center">
                    <Avatar
                      size={110}
                      src={imageUtility.getProfile(
                        explanation?.personnel?.profile,
                      )}
                      icon={<UserOutlined />}
                      className="border-4 border-white shadow-md"
                      style={{ backgroundColor: "#001529" }}
                    />
                    <div className="mt-4">
                      <Text strong className="block text-lg">
                        {nameFormat(explanation?.personnel)}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        SN: {explanation?.personnel?.serialNumber}
                      </Text>
                    </div>
                  </div>
                  <Divider className="my-3" />
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Rank">
                      {explanation?.personnel?.rank?.rankName}
                    </Descriptions.Item>
                    <Descriptions.Item label="ETE Date">
                      <Tag color="volcano" className="font-bold">
                        {formatDateToMilitary(explanation?.nextEte)}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider className="my-3" />
                  <Text type="secondary" className="text-xs">
                    Remaining Time:
                  </Text>
                  <div
                    className={`text-xl font-bold ${isCritical ? "text-red-600" : "text-blue-600"}`}
                  >
                    {formatDaysToYMD(explanation?.remainingDays)}
                  </div>
                </Card>

                <Card title="Admin Remarks" size="small" className="shadow-sm">
                  <Paragraph italic type="secondary" className="m-0 text-sm">
                    "
                    {explanation?.remarks ||
                      "No specific instructions provided."}
                    "
                  </Paragraph>
                </Card>
              </Space>
            </div>

            {/* RIGHT COLUMN */}
            {!selectedEte && (
              <div className="lg:col-span-3">
                <Card title="Required Documentation" className="shadow-sm p-0">
                  <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <Title level={5} className="mt-0 text-blue-800">
                      Instructions:
                    </Title>
                    <ul className="list-none pl-0 text-slate-600 space-y-2">
                      <li>
                        1. <Text strong>Download</Text> the ETE Explanation
                        format.
                      </li>
                      <li>
                        2. Fill out and <Text strong>affix your signature</Text>
                        .
                      </li>
                      <li>
                        3. <Text strong>Scan</Text> as a PDF and upload below.
                      </li>
                    </ul>
                    <Button
                      type="default"
                      icon={<DownloadOutlined />}
                      className="mt-4 border-blue-400 text-blue-600"
                      onClick={handleDownloadFormat}
                    >
                      Download ETE Explanation Format
                    </Button>
                  </div>

                  <Text strong className="block mb-2">
                    Upload Signed Document
                  </Text>
                  <Upload.Dragger
                    multiple={false}
                    fileList={fileList}
                    accept=".pdf"
                    beforeUpload={(file) => {
                      const isPdf = file.type === "application/pdf";
                      if (!isPdf) {
                        message.error(`${file.name} is not a PDF file`);
                      }
                      return false; // Prevent auto-upload
                    }}
                    onChange={({ fileList }) => {
                      const lastFile = fileList.slice(-1);
                      setFileList(
                        lastFile[0]?.originFileObj?.type === "application/pdf"
                          ? lastFile
                          : [],
                      );
                      handleFileChange({ fileList });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <FilePdfOutlined style={{ color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag scanned PDF here
                    </p>
                    <p className="ant-upload-hint">
                      Only PDF files are accepted.
                    </p>
                  </Upload.Dragger>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <Text type="secondary" italic className="text-xs">
                      Requirement: 11 months prior to ETE.
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={handleButtonClick}
                      disabled={fileList.length === 0}
                      className="px-8"
                    >
                      Submit Document
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            <div className={`lg:col-span-${selectedEte?"3":"4"}`}>
              <Card
                title="Document Preview"
                className="shadow-sm h-full flex flex-col"
              >
                {previewUrl ? (
                  <div className="flex-grow">
                    <iframe
                      src={`${previewUrl}`}
                      title="PDF Preview"
                      className="w-full h-[600px] border rounded shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 border-2 border-dashed border-gray-200 rounded">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Upload a document to see preview"
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Space>
      </div>
    </div>
  );
}
