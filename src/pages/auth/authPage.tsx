import { Tabs, Card, Typography, Divider } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import SignupTab from "./SignupTab";
import LoginTab from "./LoginTab";

const { Title } = Typography;

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001529] p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px] opacity-10" />

      <Card
        className="w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden border-none bg-white/95 backdrop-blur-md"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex   flex-col md:flex-row min-h-[600px]">
          <div className="hidden md:flex md:w-1/2 bg-[#002140] p-12 flex-col justify-between  relative overflow-hidden">
            <div className="flex justify-items-center">
              <div className="relative z-10 ">
                <img
                  src="/main-logo.png"
                  alt="RTC Aurora Logo"
                  className="w-50 h-50 mb-6 drop-shadow-lg "
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/150?text=RTC+LOGO")
                  }
                />
                <Title
                  level={2}
                  className="!text-white !m-0 !font-bold tracking-tight"
                >
                  RTC Aurora <span className="text-blue-400">E-Monitoring</span>
                </Title>
                <span className="text-gray-300 block mt-2 text-lg">
                  Regional Training Center Aurora
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-white/80 mb-4">
                <SafetyCertificateOutlined className="text-2xl text-blue-400" />
                <span className="text-sm">
                  Secure Administrative Access Protocol
                </span>
              </div>
              <span className="text-gray-200 text-xs">
                © 2026 RTC Aurora E-Monitoring. All Rights Reserved.
              </span>
            </div>

            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
              alt="Security Background"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-8 md:hidden text-center">
              <Title level={3}>RTC Aurora</Title>
            </div>

            <Tabs
              defaultActiveKey="1"
              animated={{ inkBar: true, tabPane: true }}
            >
              <Tabs.TabPane
                tab={<span className="px-4 text-lg">Login</span>}
                key="1"
              >
                <LoginTab />
              </Tabs.TabPane>
              
              <Tabs.TabPane
                tab={<span className="px-4 text-lg">Register</span>}
                key="2"
              >
                <SignupTab />
              </Tabs.TabPane>
            </Tabs>

            <Divider plain className="text-gray-400 text-xs">
              Official Portal
            </Divider>
          </div>
        </div>
      </Card>
    </div>
  );
}
