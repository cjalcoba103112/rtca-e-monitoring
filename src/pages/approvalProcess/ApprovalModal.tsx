import React, { useState } from "react";
import { Input, Modal, Button, Popconfirm, Image, Row, Col, Divider, Tag, Typography, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";
import imageUtility from "../../utils/imageUtility";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import ApprovalTrail from "./ApprovalTrail";
import approvalProccessService from "../../services/approvalProccessService";
import workflowStepsService from "../../services/workflowStepsService";
import { useQuery } from "@tanstack/react-query";
import activityAppealService from "../../services/activityAppealService";


const { TextArea } = Input;
const { Text, Title } = Typography;

// Define the available stages as a type
export type ApprovalStage = 1 | 2 | 3 | 4;

type SaveModalProps = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: PersonnelActivity | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
  viewOnly?: boolean
};

export default function ApprovalModal({
  selectedActivity,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
  viewOnly,
}: SaveModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");

  const { data: steps = [] } = useQuery({
    queryKey: ["steps"],
    queryFn: workflowStepsService.getAll,
  });

  const { data: activityAppeal } = useQuery({
    queryKey: ["activityAppeal", selectedActivity?.personnelActivityId],
    queryFn: async () => await activityAppealService.getAll({ personnelActivityId: selectedActivity?.personnelActivityId }),
    initialData: []
  });



  // 1. Constants for Rank Category IDs to avoid magic numbers
  const RANK_CATEGORY = {
    OFFICER: 1,
    NON_OFFICER: 2,
  };

  // 2. Optimized lookup function
  const getWorkStepName = (
    stepNumber: number,
    rankCategoryId: number
  ): string => {
    if (!steps) return "Loading...";

    const step = steps.find(
      (w) => w.stepNumber === stepNumber && w.rankCategoryId === rankCategoryId
    );

    return step?.role?.roleName ?? "Review";
  };

  // 3. Unified UI Configurator
  const getStageUI = (stage: number, rankCategoryId: number,) => {
    const label = getWorkStepName(stage, rankCategoryId);

    const configs: Record<number, any> = {
      1: { label, icon: <InfoCircleOutlined />, color: "#1890ff", secondary: "Recommendation" },
      2: { label, icon: <StarOutlined />, color: "#722ed1", secondary: "Approval" },
      3: { label, icon: <SafetyCertificateOutlined />, color: "#fa8c16", secondary: "Clearance" },
      4: { label, icon: <TrophyOutlined />, color: "#cf1322", secondary: "Final Approval" },
    };

    return configs[stage] ?? { label: "Review", icon: <InfoCircleOutlined />, color: "#1890ff", secondary: "Action" };
  };

  const currentStage: number = selectedActivity?.approvalProccess?.currentStage ?? 1;
  const personnelType = selectedActivity?.personnel?.rank?.rankCategory?.name;
  const stageUI = personnelType == "Officer" ? getStageUI(currentStage - 2, RANK_CATEGORY.OFFICER) : getStageUI(currentStage, RANK_CATEGORY.NON_OFFICER);


  const handleAction = async (isApprove: boolean) => {
    try {
      setIsSubmitting(true);
      const id = selectedActivity?.approvalProccess?.id;
      if (currentStage == 1) {
        await approvalProccessService.updateStageOne({
          id,
          stageOneIsApprove: isApprove,
          stageOneRemarks: remarks
        });
      } else if (currentStage == 2) {
        await approvalProccessService.updateStageTwo({
          id,
          stageTwoIsApprove: isApprove,
          stageTwoRemarks: remarks
        });
      }
      else if (currentStage == 3) {
        await approvalProccessService.updateStageThree({
          id,
          stageThreeIsApprove: isApprove,
          stageThreeRemarks: remarks
        });
      }
      else {
        await approvalProccessService.updateFinalStage({
          id,
          stageFourIsApprove: isApprove,
          stageFourRemarks: remarks
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
const stage = personnelType == "Officer" ? currentStage - 2 : currentStage;
  return (
    <Modal
      title={
        <Space>
          <span style={{ color: stageUI.color }}>{stageUI.icon}</span>
          <span className="font-bold">Stage {stage}: {stageUI.label} {stageUI.secondary}</span>
        </Space>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={1500}
      centered
      destroyOnClose
      footer={null}
    >

      <div className="grid lg:grid-cols-3 gap-3">
        <ApprovalTrail
          currentStage={currentStage}
          activity={selectedActivity}
          viewOnly={viewOnly}
        />

        <div className="flex flex-col gap-6 py-2 col-span-2">


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

                <div className="grid md:grid-cols-2">
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

                  <div>
                    <Text type="secondary" className="text-[10px] uppercase font-bold block">Status</Text>
                    <Tag color="blue" className="mt-1 font-semibold uppercase">{selectedActivity?.status}</Tag>
                  </div>
                   <div>
                    <Text type="secondary" className="text-[10px] uppercase font-bold block">Primary Departmemt</Text>
                    <Tag color="green" className="mt-1 font-semibold uppercase">{selectedActivity?.personnel?.department?.departmentName}</Tag>
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
                {selectedActivity?.reason || "N/A"}
              </div>
            </div>

            {selectedActivity?.status === "Appeal" && activityAppeal[stage-2]?.remarks && (
              <div className="mt-4">
                <Text type="warning" className="text-[10px] uppercase font-bold block mb-1">
                  Appeal Remarks
                </Text>
                <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4 text-slate-700 whitespace-pre-line italic shadow-sm">
                  {activityAppeal[stage-2]?.remarks || "N/A"}
                </div>
              </div>
            )}

          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* --- DYNAMIC REMARKS --- */}
          {!viewOnly &&
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

          }

        </div>
      </div>
      {!viewOnly &&
        <div className="flex justify-end">
          <div className="grid md:grid-cols-3 gap-2">
            <Button key="cancel" onClick={() => setIsModalVisible(false)} disabled={isSubmitting}>
              Cancel
            </Button>
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
            </Popconfirm>
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
            </Popconfirm>
          </div>
        </div>
      }


    </Modal>
  );
}