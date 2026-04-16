import React, { useState } from 'react';
import { Card, Descriptions, Input, Button, Upload, Alert, Tag, Space, Typography, Divider, Spin, Avatar, message } from 'antd';
import { UploadOutlined, SendOutlined, WarningOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import emailEteCommunicationService from '../../services/emailEteCommunicationService';
import nameFormat from '../../utils/nameFormat';
import { formatDateToMilitary } from '../../utils/formatDateToMilitary';
import { formatDaysToYMD } from '../../utils/formatDaysToYMD';
import imageUtility from '../../utils/imageUtility';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const EteExplanationIndex: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const { token } = useParams<{ token: string }>();
    const [explanationText, setExplanationText] = useState("");
    const { data: explanation, isFetching } = useQuery({
        queryKey: ["explanation", token],
        queryFn: async () => await emailEteCommunicationService.getbyToken(token ?? ""),
    });


    const handleButtonClick = async () => {


        setLoading(true);
        try {
            // 1. Get the file from Ant Design's fileList state
            const file = fileList[0]?.originFileObj;

            // 2. Call the service directly
            await emailEteCommunicationService.updateByToken(token!, explanationText, file);

            message.success("Submitted successfully!");
        } catch (error: any) {
            message.error(error.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const isCritical = (explanation?.remainingDays ?? 0) < 330;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
                <Title level={3} className="mb-6">ETE Compliance Portal</Title>

                <Space direction="vertical" size="large" className="w-full">
                    {/* Responsive Alert */}
                    <Alert
                        message="Immediate Action Required"
                        description={`You are currently ${formatDaysToYMD(explanation?.remainingDays)} before your ETE. Administrative regulations require document finalization 11 months prior.`}
                        type="error"
                        showIcon
                        icon={<WarningOutlined />}
                        className="shadow-sm"
                    />

                    {/* MAIN GRID: Mobile stack (1 col), Desktop split (3 cols) */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* LEFT COLUMN: Personnel Summary (1/3 width on desktop) */}
                        <div className="lg:col-span-1">
                            <Space direction="vertical" className="w-full" size="middle">
                                <Card bordered={false} className="shadow-sm">
                                    <div className="mb-5 text-center">
                                        <Avatar
                                            size={110}
                                            src={imageUtility.getProfile(explanation?.personnel?.profile)}
                                            icon={<UserOutlined />}
                                            className="border-4 border-white shadow-md"
                                            style={{ backgroundColor: '#001529' }}
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

                                    <Text type="secondary" className="text-xs">Remaining Time:</Text>
                                    <div className={`text-xl font-bold ${isCritical ? 'text-red-600' : 'text-blue-600'}`}>
                                        {formatDaysToYMD(explanation?.remainingDays)}
                                    </div>
                                </Card>

                                <Card title="Remarks" size="small" className="shadow-sm">
                                    <Paragraph italic type="secondary" className="m-0 text-sm">
                                        "{explanation?.remarks || 'No specific instructions provided.'}"
                                    </Paragraph>
                                </Card>
                            </Space>
                        </div>

                        {/* RIGHT COLUMN: Submission Form (2/3 width on desktop) */}
                        <div className="lg:col-span-2">
                            <Card title="Formal Explanation & Document Submission" className="shadow-sm">
                                <FormLayout
                                    label="Statement of Explanation"
                                    description="Provide a detailed reason for the delay in document processing."
                                />

                                <TextArea
                                    onChange={(e) => setExplanationText(e.target.value)}
                                    rows={6}
                                    placeholder="Enter your formal explanation here..."
                                    className="mt-4 mb-6"
                                />

                                <Title level={5}>Supporting Documents</Title>
                                <Paragraph type="secondary" className="text-xs">
                                    Attach medical certificates, pending unit clearances, or any supporting evidence (PDF).
                                </Paragraph>
                                <Upload.Dragger
                                    multiple={false}
                                    fileList={fileList}
                                    accept=".pdf" // 1. Restricts the file selection dialog
                                    beforeUpload={(file) => {
                                        const isPdf = file.type === 'application/pdf';
                                        if (!isPdf) {
                                            message.error(`${file.name} is not a PDF file`);
                                        }
                                        return false; // 2. Prevents automatic upload
                                    }}
                                    onChange={({ fileList }) => {
                                        // Only keep the most recent file and ensure it's a PDF
                                        const lastFile = fileList.slice(-1);
                                        if (lastFile[0]?.originFileObj?.type === 'application/pdf') {
                                            setFileList(lastFile);
                                        } else {
                                            setFileList([]); // Clear list if it's invalid
                                        }
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined style={{ color: '#ff4d4f' }} />
                                    </p>
                                    <p className="ant-upload-text">Click or drag PDF to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single PDF response only.</p>
                                </Upload.Dragger>

                                <Divider />

                                <div className="text-right">
                                    <Button
                                        type="primary"
                                        loading={loading}
                                        onClick={handleButtonClick}
                                    >
                                        Submit Formal Response
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Space>
            </div>
        </div>
    );
};

const FormLayout = ({ label, description }: { label: string, description: string }) => (
    <div>
        <Text strong className="text-base">{label}</Text>
        <br />
        <Text type="secondary">{description}</Text>
    </div>
);

export default EteExplanationIndex;