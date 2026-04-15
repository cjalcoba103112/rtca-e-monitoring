import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/main-logo.png"


const { Sider } = Layout;

type SidebarLayouProps = {
  collapsed: boolean;
};

export default function SidebarLayout({ collapsed }: SidebarLayouProps) {
  const navigate = useNavigate();

  return (
    <Sider
      trigger={null}
      breakpoint="lg"
      collapsedWidth={0}
      collapsible
      collapsed={collapsed}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
   <img src={logo} alt="logo" className="w-30 h-30 justify-self-center m-2" />

     
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/"]}
          style={{ background: "transparent", border: "none" }}
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Home",
              onClick: () => navigate("/"),
            },
            {
              key: "statistics",
              icon: <BarChartOutlined />,
              label: "Statistics",
              onClick: () => navigate("/statistics"),
            },
             {
              key: "/user",
              icon: <HomeOutlined />,
              label: "User",
              onClick: () => navigate("/user"),
            },
            {
              key: "personnel-group",
              icon: <TeamOutlined />,
              label: "Personnel",
              children: [
                { key: "/personnel", label: "Personnel", onClick: () => navigate("/personnel") },
                { key: "/ete", label: "ETE", onClick: () => navigate("/ete") },
                { key: "/leave-request", label: "Leave Request", onClick: () => navigate("/leave-request") },
                { key: "/leave-approval", label: "Leave Approval", onClick: () => navigate("/leave-approval") },
                { key: "/leave-history", label: "Leave Credits History", onClick: () => navigate("/leave-history") },
              ],
            },
            {
              key: "activity-group",
              icon: <CalendarOutlined />,
              label: "Reference",
              children: [
                { key: "/activity-type", label: "Activity Type", onClick: () => navigate("/activity-type") },
                { key: "/rank", label: "Rank", onClick: () => navigate("/rank") },
                { key: "/department", label: "Department", onClick: () => navigate("/department") },
              ],
            },
          ]}
        />
     
    </Sider>
  );
}