import ActivityChart from "./charts/ActivityChart";
import DepartmentChart from "./charts/DepartmentChart";
import DeptActivityChart from "./charts/DeptActivityChart";

export default function StatisticPage() {
  return (
    <div style={{ padding: 20 }}>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-2">
        <ActivityChart />
        <DepartmentChart />
        <DeptActivityChart />
      </div>
    </div>
  );
}
