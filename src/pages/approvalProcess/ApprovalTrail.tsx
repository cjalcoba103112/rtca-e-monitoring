import React from "react";
import { Steps, Typography, Tag } from "antd";
import type { ApprovalProccess } from "../../@types/ApprovalProccess";
import nameFormat from "../../utils/nameFormat";
import type { ApprovalStage } from "./ApprovalModal";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";

const { Text, Title } = Typography;

type ApprovalTrailProps = {
  currentStage: ApprovalStage;
  activity: PersonnelActivity | null | undefined;
};

const ApprovalTrail: React.FC<ApprovalTrailProps> = ({ currentStage, activity }) => {

  const renderStageDetail = (
    stageNumber: number, 
    isApproved: boolean | null | undefined, 
    remarks: string | null | undefined, 
    personnel: any,
    bgClass: string
  ) => {
    if (currentStage <= stageNumber) return null;

    return (
      <div className={`${bgClass} p-3 rounded-lg border border-slate-100 mt-2 text-[12px] shadow-sm`}>
        <div className="flex justify-between items-center mb-1">
          <Text strong>{nameFormat(personnel)}</Text>
          <Tag color={isApproved ? "success" : "error"} className="text-[10px] m-0 px-1">
            {isApproved ? "APPROVED" : "DISAPPROVED"}
          </Tag>
        </div>
        <div className="text-slate-500 italic leading-relaxed">
          "{remarks || "No remarks provided."}"
        </div>
      </div>
    );
  };

  const approvalData = activity?.approvalProccess;
  
  return (
    <div className="pl-4 h-full">
      <Title level={5} className="mb-6 flex items-center gap-2">
        <span className="w-2 h-5 bg-blue-500 rounded-full inline-block"></span>
        Approval Trail
      </Title>
      
      <Steps
        direction="vertical"
        size="small"
        current={currentStage - 1}
        items={[
          {
            title: 'Stage 1: CMAA Recommendation',
            description: renderStageDetail(1, approvalData?.cmaaIsApprove, approvalData?.cmaaRemarks, approvalData?.cmaa, "bg-blue-50/50"),
          },
          {
            title: 'Stage 2: OIC Approval',
            description: renderStageDetail(2, approvalData?.oicIsApprove, approvalData?.oicRemarks, approvalData?.oic, "bg-purple-50/50"),
          },
          {
            title: 'Stage 3: CSG Clearance',
            description: renderStageDetail(3, approvalData?.csgIsApprove, approvalData?.csgRemarks, approvalData?.csg, "bg-orange-50/50"),
          },
          {
            title: 'Stage 4: CO Final Action',
            description: currentStage === 4 ? (
              <Text type="secondary" className="text-[11px] italic">Awaiting your final review...</Text>
            ) : null,
          },
        ]}
      />
    </div>
  );
};

export default ApprovalTrail;