import React, { useState } from "react";
import { Modal, Card, Progress, Image, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import personelService from "../../services/personelService";
import type { Personnel } from "../../@types/Personnel";
import nameFormat from "../../utils/nameFormat";
import getRandomColor from "../../utils/getRandomColor";
import PersonnelActivitiesTable from "./PersonnelActivitiesTable";
import imageUtility from "../../utils/imageUtility";
import { UserOutlined } from "@ant-design/icons";
import YearSelect from "../../componets/YearSelect";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedPersonnel?: Personnel | null;
};

const LeaveCreditModal: React.FC<Props> = ({
  open,
  onClose,
  selectedPersonnel,
}) => {
  const [selectedYear, setYear] = useState<number | null>(
    new Date().getFullYear(),
  );
  const { data: personnelCredits } = useQuery({
    queryKey: [
      "personnelCredits",
      selectedPersonnel?.personnelId,
      selectedYear,
    ],
    queryFn: async () =>
      await personelService.getPersonnelCredits(
        selectedPersonnel?.personnelId!,
        selectedYear,
      ),
    enabled: !!selectedPersonnel?.personnelId && open,
  });

  return (
    <Modal
      title="Leave Credits Management"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1400}
      centered
    >
      {/* Top Section: Profile (Left) and Credits (Right) */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Side: Profile Info (approx 25%) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <Image
            width={220}
            height={220}
            className="rounded-xl shadow-lg border-4 border-white"
            style={{ objectFit: "cover" }}
            src={imageUtility.getProfile(selectedPersonnel?.profile)}
            fallback="https://www.gravatar.com/avatar/0000?d=mp&f=y"
            placeholder={
              <div className="flex items-center justify-center bg-gray-200 h-full w-full rounded-xl">
                <UserOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
              </div>
            }
          />
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 m-0">
              {nameFormat(selectedPersonnel)}
            </h2>
            <p className="text-gray-500 uppercase tracking-wider text-xs font-semibold mt-1">
              Personnel Profile
            </p>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Reporting Year:</span>
              <YearSelect
                value={selectedYear}
                onChange={(val) => setYear(val)}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Credits Grid (approx 75%) */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {personnelCredits?.map((leave: any, index: number) => {
              const percent =
                leave.maxCredits > 0
                  ? (leave.usedCredits / leave.maxCredits) * 100
                  : 0;
              const color = getRandomColor(index);

              return (
                <Card
                  key={index}
                  hoverable
                  bodyStyle={{ padding: "16px" }}
                  className="rounded-xl border-l-4 overflow-hidden shadow-sm"
                  style={{ borderLeftColor: color }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-700 m-0 truncate pr-2">
                      {leave.activityTypeName}
                    </h3>
                    <Tag color={color} className="mr-0 rounded-full font-bold">
                      {leave.remainingCredits} Left
                    </Tag>
                  </div>

                  <div className="flex justify-between text-xs mb-1 text-gray-500">
                    <span>Used: {leave.usedCredits}</span>
                    <span>Limit: {leave.maxCredits}</span>
                  </div>

                  <Progress
                    percent={Math.round(percent)}
                    strokeColor={percent > 90 ? "#ff4d4f" : color}
                    status={percent > 90 ? "exception" : "active"}
                    showInfo={false}
                    strokeWidth={10}
                  />

                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      Usage Status
                    </span>
                    <span className="text-xs font-semibold">
                      {Math.round(percent)}%
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Table (Full Width) */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center mb-4">
          <div className="h-6 w-1 bg-blue-500 rounded-full mr-2"></div>
          <h3 className="text-lg font-bold text-gray-800 m-0">
            Activity Breakdown
          </h3>
        </div>
        <PersonnelActivitiesTable
          selectedPersonnel={selectedPersonnel}
          year={selectedYear}
        />
      </div>
    </Modal>
  );
};

export default LeaveCreditModal;
