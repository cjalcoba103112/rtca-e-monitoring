import { Card, Tabs } from "antd";
import ActivityStatus from "./tabs/ActivityStatus";
import ByRanks from "./tabs/ByRanks";

const { TabPane } = Tabs;

function HomePage() {
  return (
    <Card className="m-2">
      <Tabs defaultActiveKey="activity">
        <TabPane tab="Activity Status" key="activity">
          <ActivityStatus />
        </TabPane>
        <TabPane tab="By Rank" key="rank">
          <ByRanks />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default HomePage;
