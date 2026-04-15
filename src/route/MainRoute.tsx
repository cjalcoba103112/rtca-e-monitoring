// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import RankIndex from "../pages/rank/RankIndex";
import DepartmentIndex from "../pages/department/DepartmentIndex";
import PersonnelIndex from "../pages/personel/PersonelIndex";
import ActivityTypeIndex from "../pages/activity-type/ActivityTypeIndex";
import StatisticPage from "../pages/statistic/StatisticPage";
import HomePage from "../pages/home/HomePage";
import EtePage from "../pages/ete/EtePage";
import AuthPage from "../pages/auth/authPage";
import LeaveHistoryPage from "../pages/leave-history/LeaveHistoryPage";
import LeaveTypesPage from "../pages/LeaveTypes/LeavePage";
import RequestLeave from "../pages/personnel-activity/RequestLeave";
import ApprovalLeave from "../pages/personnel-activity/ApprovalLeave";
import { useAuth } from "../context/UserContext";
import UserIndex from "../pages/user/UserIndex";

export default function MainRoute() {
  const {user} = useAuth()
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <MainLayout /> : <Navigate to="/auth" replace />}
        >
          <Route index element={<HomePage />} />
          <Route path="/Statistics" element={<StatisticPage />} />
          <Route path="/personnel" element={<PersonnelIndex />} />
          <Route path="/rank" element={<RankIndex />} />
          <Route path="/activity-type" element={<ActivityTypeIndex />} />
          <Route path="/leave-request" element={<RequestLeave />} />
          <Route path="/leave-approval" element={<ApprovalLeave />} />
          <Route path="/department" element={<DepartmentIndex />} />
          <Route path="/ete" element={<EtePage />} />
          <Route path="/leave-history" element={<LeaveHistoryPage />} />
          <Route path="/leave-Types" element={<LeaveTypesPage />} />
           <Route path="/user" element={<UserIndex />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
