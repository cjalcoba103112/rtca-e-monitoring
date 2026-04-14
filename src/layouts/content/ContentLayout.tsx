import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function ContentLayout() {
  return (
    <Content style={{ padding: 24 }}>
      <Outlet />
    </Content>
  );
}
