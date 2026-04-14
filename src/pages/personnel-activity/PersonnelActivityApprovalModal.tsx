import React, { useState } from "react";
import { Input, Modal, Button, Popconfirm, Image } from "antd";
import type { PersonnelActivity } from "../../@types/PersonnelActivity";
import personnelActivityService from "../../services/personnelActivityService";
import imageUtility from "../../utils/imageUtility";
import nameFormat from "../../utils/nameFormat";
import { formatDateToMilitary } from "../../utils/formatDateToMilitary";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

type SaveModalProps = {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: PersonnelActivity | null;
  isModalVisible: boolean;
  onAfterSave: () => void;
};

export default function PersonnelActivityApprovalModal({
  selectedActivity,
  isModalVisible,
  setIsModalVisible,
  onAfterSave,
}: SaveModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await personnelActivityService.approve(
        selectedActivity?.personnelActivityId ?? 0,
        remarks,
      );
      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.log("Validation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsSubmitting(true);
      await personnelActivityService.decline(
        selectedActivity?.personnelActivityId ?? 0,
        remarks,
      );
      setIsModalVisible(false);
      onAfterSave();
    } catch (err) {
      console.log("Validation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => setIsModalVisible(false);

  return (
    <Modal
      title="Pending Approval"
      open={isModalVisible}
      okText={false}
      onCancel={handleClose}
      okButtonProps={{
        loading: isSubmitting,
      }}
      cancelButtonProps={{
        danger: true,
      }}
      footer={[
        <Popconfirm
          key="decline-confirm"
          title="Decline Request"
          description="Are you sure you want to decline this leave request? An email will be sent to the personnel."
          onConfirm={handleDecline}
          okText="Yes, Decline"
          cancelText="No"
          okButtonProps={{ danger: true, loading: isSubmitting }}
        >
          <Button danger loading={isSubmitting}>
            Decline
          </Button>
        </Popconfirm>,

        <Popconfirm
          key="approve-confirm"
          title="Approve Request"
          description="Confirm approval for this leave request?"
          onConfirm={handleApprove}
          okText="Yes, Approve"
          cancelText="No"
          okButtonProps={{ loading: isSubmitting }}
        >
          <Button type="primary" loading={isSubmitting}>
            Approve
          </Button>
        </Popconfirm>,
      ]}
      width={1200}
      destroyOnClose
    >
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full max-w-full">
        {/* Flex container: Column on mobile, Row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-6">
          {/* Profile Image / Avatar - Centered on mobile */}
          <div className="flex-shrink-0">
            <div className="h-40 w-40 md:h-28 md:w-28 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
              {selectedActivity?.personnel?.profile ? (
                <Image
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                  src={imageUtility.getProfile(
                    selectedActivity.personnel.profile,
                  )}
                  fallback="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  placeholder={
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UserOutlined
                        style={{ fontSize: 24, color: "#bfbfbf" }}
                      />
                    </div>
                  }
                  preview={{
                    mask: <div style={{ fontSize: 12 }}>View</div>, // Shows "View" text on hover
                  }}
                />
              ) : (
                <span className="text-2xl font-bold text-slate-400">
                  {selectedActivity?.personnel?.firstName?.charAt(0)}
                </span>
              )}
            </div>
            <div className="xs:col-span-2 border-b border-slate-50 pb-2 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Full Name & Rank
              </span>
              <div className="text-lg font-bold text-slate-800 leading-tight">
                {nameFormat(selectedActivity?.personnel)}
              </div>
            </div>
          </div>

          {/* Grid for Personnel Details: 1 column on mobile, 2 columns on small/medium screens */}
          <div className="flex-1 w-full grid lg:grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-4">
            {/* Full Name & Rank - Stays top and spans full width */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Title
              </span>
              <div className="text-sm font-semibold text-slate-600 truncate">
                {selectedActivity?.title || "N/A"}
              </div>
            </div>

            {/* Detail Blocks */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Type
              </span>
              <div className="text-sm font-semibold text-slate-600 truncate">
                {selectedActivity?.activityType?.activityTypeName || "N/A"}
              </div>
            </div>

            <div className="xs:col-span-2 md:col-span-1 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Duration
              </span>
              <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                {formatDateToMilitary(selectedActivity?.startDate)} —{" "}
                {formatDateToMilitary(selectedActivity?.endDate)}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Day/s
              </span>
              <div className="text-sm font-semibold text-slate-600">
                {selectedActivity?.days || "N/A"}
              </div>
            </div>

            {/* Duration usually takes more space, so we can span it if needed */}

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </span>
              <div className="text-sm font-semibold text-slate-600">
                {selectedActivity?.status || "N/A"}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Reason for Action
              </span>
              <div className="text-sm font-semibold text-slate-600 whitespace-pre-line">
                {selectedActivity?.reason || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer remains consistent but adapts to width */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-500 uppercase">
            Service Status
          </span>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {selectedActivity?.personnel?.employmentStatus || "Active"}
          </span>
        </div>
      </div>

      <label>Remarks :</label>
      <TextArea
        onChange={(e) => setRemarks(e.target.value)}
        className="mb-3"
        rows={5}
        placeholder="Enter any additional notes or remarks here..."
        showCount
        maxLength={2000}
      />
    </Modal>
  );
}
