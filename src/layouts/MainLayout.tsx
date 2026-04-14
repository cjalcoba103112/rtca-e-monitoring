import  { useState } from "react";
import { Layout } from "antd";

import SidebarLayout from "./content/SidebarLayout";
import HeaderLayout from "./content/HeaderLayout";
import ContentLayout from "./content/ContentLayout";
import { SidebarContext } from "./context/SidebarContext";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  return (
    <SidebarContext value={{ collapsed, setCollapsed }}>
      <Layout style={{ minHeight: "100vh" }}>
        <SidebarLayout collapsed={collapsed} />

        <Layout className="site-layout">
          <HeaderLayout />
          <ContentLayout />
        </Layout>
      </Layout>
    </SidebarContext>

  );
}
