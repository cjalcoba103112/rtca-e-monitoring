import React, { useState } from "react";
import { Input, Modal, Button, Popconfirm, Image, Row, Col, Divider, Tag, Typography, Space, Alert } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";
import personnelActivityService from "../../services/personnelActivityService";
import imageUtility from "../../utils/imageUtility";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import ApprovalTrail from "./ApprovalTrail";
import approvalProccessService from "../../services/approvalProccessService";


const { TextArea } = Input;
const { Text, Title } = Typography;

// Define the available stages as a type
export type ApprovalStage = 1 | 2 | 3 | 4;

type SaveModalProps = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: PersonnelActivity | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function ApprovalModal({
  selectedActivity,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");

  // Helper to get stage-specific UI configuration
  const getStageUI = (stage: ApprovalStage) => {
    switch (stage) {
      case 1:
        return { label: "CMAA", icon: <InfoCircleOutlined />, color: "#1890ff", secondary: "Recommendation" };
      case 2:
        return { label: "OIC", icon: <StarOutlined />, color: "#722ed1", secondary: "Approval" };
      case 3:
        return { label: "CSG", icon: <SafetyCertificateOutlined />, color: "#fa8c16", secondary: "Clearance" };
      case 4:
        return { label: "CO", icon: <TrophyOutlined />, color: "#cf1322", secondary: "Final Approval" };
      default:
        return { label: "Review", icon: <InfoCircleOutlined />, color: "#1890ff", secondary: "Action" };
    }
  };
  const currentStage = selectedActivity?.approvalProccess?.currentStage ?? 1;
  const stageUI = getStageUI(currentStage);


  const handleAction = async (isApprove: boolean) => {
    try {
      setIsSubmitting(true);
      const id = selectedActivity?.approvalProccess?.id;
      if (currentStage == 1) {

        await approvalProccessService.updateByCMAA({
          id,
          cmaaIsApprove: isApprove,
          cmaaRemarks: remarks
        });
      } else if (currentStage == 2) {
        await approvalProccessService.updateByOIC({
          id,
          oicIsApprove: isApprove,
          oicRemarks: remarks
        });
      }
      else if (currentStage == 3) {
        await approvalProccessService.updateByCSG({
          id,
          csgIsApprove: isApprove,
          csgRemarks: remarks
        });
      }
      else {
        await approvalProccessService.updateByCO({
          id,
          coIsApprove: isApprove,
          coRemarks: remarks
        }, selectedActivity?.personnelActivityId ?? 0);
      }
      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <span style={{ color: stageUI.color }}>{stageUI.icon}</span>
          <span className="font-bold">Stage {currentStage}: {stageUI.label} {stageUI.secondary}</span>
        </Space>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={1500}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={() => setIsModalVisible(false)} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Popconfirm
          key="decline"
          title={`Disapprove as ${stageUI.label}?`}
          description="This will notify the personnel via email."
          onConfirm={() => handleAction(false)}
          okText="Yes, Decline"
          okButtonProps={{ danger: true, loading: isSubmitting }}
        >
          <Button danger icon={<CloseCircleOutlined />} loading={isSubmitting}>
            Disapprove
          </Button>
        </Popconfirm>,
        <Popconfirm
          key="approve"
          title={currentStage === 4 ? "Submit Final Approval?" : "Approve and forward to next stage?"}
          onConfirm={() => handleAction(true)}
          okText={currentStage === 4 ? "Yes, Final Approval" : "Yes, Approve"}
          okButtonProps={{ loading: isSubmitting }}
        >
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={isSubmitting}
            style={{ backgroundColor: stageUI.color, borderColor: stageUI.color }}
          >
            {currentStage === 4 ? "Final Approval" : "Approve & Forward"}
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-3">
        <ApprovalTrail currentStage={currentStage} activity={selectedActivity} />

        <div className="flex flex-col gap-6 py-2 col-span-2">
          {/* Stage Progress Banner */}
          <Alert
            message={
              <span>
                You are acting as the <strong>{stageUI.label}</strong> for this request.
                {currentStage < 4 ? ` Upon approval, this will be forwarded for Stage ${currentStage + 1} review.` : " This is the final stage of the approval process."}
              </span>
            }
            type="info"
            showIcon
            style={{ backgroundColor: `${stageUI.color}10`, borderColor: `${stageUI.color}30` }}
          />

          {/* --- HEADER: PERSONNEL INFO --- */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={6} md={4} className="flex justify-center">
                <Image
                  width={110}
                  height={110}
                  className="rounded-lg border-2 border-white shadow-md object-cover"
                  src={imageUtility.getProfile(selectedActivity?.personnel?.profile)}
                  fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                />
              </Col>

              <Col xs={24} sm={18} md={20}>
                <div className="mb-4">
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Applicant Details</Text>
                  <Title level={4} style={{ margin: 0 }}>{nameFormat(selectedActivity?.personnel)}</Title>
                  <Tag color="blue" className="mt-1 font-semibold uppercase">{selectedActivity?.personnel?.employmentStatus || "Active"}</Tag>
                </div>

                <div className="grid md:grid-cols-3">
                  <div>
                    <Text type="secondary" className="text-[10px] uppercase font-bold block">Activity Type</Text>
                    <Text strong>{selectedActivity?.activityType?.activityTypeName || "N/A"}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-[10px] uppercase font-bold block">Duration</Text>
                    <Text strong className="text-blue-600 block">
                      {formatDateToMilitary(selectedActivity?.startDate)} — {formatDateToMilitary(selectedActivity?.endDate)}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" className="text-[10px] uppercase font-bold block">Total Days</Text>
                    <Text strong>{selectedActivity?.days || 0} Days</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* --- TITLE & REASON --- */}
          <div className="grid grid-cols-1 gap-4 px-1">
            <div>
              <Text type="secondary" className="text-[10px] uppercase font-bold block mb-1">Activity Title</Text>
              <div className="text-md font-bold text-slate-800 bg-white border border-slate-200 rounded-lg p-3">
                {selectedActivity?.title || "No Title Provided"}
              </div>
            </div>

            <div>
              <Text type="secondary" className="text-[10px] uppercase font-bold block mb-1">Personnel Reason</Text>
              <div className="bg-amber-50/30 border border-amber-100 rounded-lg p-4 text-slate-700 whitespace-pre-line italic">
                {selectedActivity?.reason || "No specific reason provided."}
              </div>
            </div>
          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* --- DYNAMIC REMARKS --- */}
          <div className="px-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase block mb-2">
              {stageUI.label} Remarks / Basis for Action <Text type="danger">*</Text>
            </label>
            <TextArea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder={`Enter your ${stageUI.label} review notes here...`}
              showCount
              maxLength={2000}
              className="rounded-lg border-slate-300"
            />
          </div>
        </div>
      </div>

    </Modal>
  );
}