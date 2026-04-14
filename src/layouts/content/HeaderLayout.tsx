import { Button, Layout } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import useSidebarContext from "../context/SidebarContext";

const { Header } = Layout;

export default function HeaderLayout() {
  const { setCollapsed, collapsed } = useSidebarContext();

  return (
    <Header 
      style={{ 
        padding: "0 24px 0 0", 
        background: "#e0e0e0", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
          RTC AURORA E-MONITORING
        </span>
      </div>

      <img 
        src="/main-logo.png" 
        alt="logo" 
        className="h-13 w-13"
        style={{ objectFit: "contain" }}
      />
    </Header>
  );
}