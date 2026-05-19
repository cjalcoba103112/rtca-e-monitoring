import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/UserContext"; 
import logo from "../../../public/main-logo.png";
import { useQuery } from "@tanstack/react-query";
import sidebarService from "../../services/sidebarService";
import type { Sidebar } from "../../@types/Sidebar";

const { Sider } = Layout;

type SidebarLayoutProps = {
  collapsed: boolean;
};

const IconMapper: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  TeamOutlined: <TeamOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  FileTextOutlined: <FileTextOutlined />,
};

export default function SidebarLayout({ collapsed }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Fetch all sidebars (for SuperAdmin view)
  const { data: allSidebars = [] } = useQuery({
    queryKey: ["sidebars"],
    queryFn: sidebarService.getAll,
  });

  // Helper to format a single Sidebar object into an AntD Menu item
  const formatMenuItem = (item?: Sidebar) => ({
    key: item?.path || item?.keyName || "",
    icon: item?.keyName ? IconMapper[item.keyName] : <FileTextOutlined />,
    label: item?.sidebarName,
    onClick: () => item?.path && navigate(item.path),
  });

  // Decide which data source to use
  // If SuperAdmin: Map all sidebars from the Master List
  // If Regular Role: Map only sidebars from the user's role mapping
  const finalMenuItems = user?.role?.isSuperAdmin
    ? allSidebars.map(formatMenuItem)
    : (user?.role?.sidebarRoleMappings?.map((m) => formatMenuItem(m.sidebar)) || []);

  return (
    <Sider
      trigger={null}
      breakpoint="lg"
      collapsedWidth={0}
      collapsible
      collapsed={collapsed}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflow:"auto"
      }}
    >
      <div className="flex justify-center p-4">
        <img 
          src={logo} 
          alt="logo" 
          className="justify-self-center m-2" 
          style={{ width: collapsed ? "30px" : "120px", transition: "width 0.2s" }} 
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ background: "transparent", border: "none" }}
        items={finalMenuItems}
      />
    </Sider>
  );
}