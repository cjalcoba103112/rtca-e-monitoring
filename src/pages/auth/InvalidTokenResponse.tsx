import React from 'react';
import { Result, Typography, Card } from 'antd';

const { Paragraph, Text } = Typography;

const InvalidTokenResponse: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      <Card 
        style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <Result
          status="error" // Use "error" for red X or "warning" for orange !
          title="Invalid or Expired Link"
          subTitle="The security token for this action is no longer valid. This usually happens if the link has already been used or has expired for your protection."
          // extra={[
          //   <Button 
          //     type="primary" 
          //     key="login" 
          //     size="large" 
          //     icon={<ArrowLeftOutlined />}
          //     onClick={() => window.location.href = '/login'}
          //   >
          //     Back to Login
          //   </Button>,
          //   <Button 
          //     key="resend" 
          //     size="large" 
          //     icon={<ReloadOutlined />}
          //     onClick={() => window.location.href = '/forgot-password'}
          //   >
          //     Request New Link
          //   </Button>,
          // ]}
        >
          <div className="desc">
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                Common reasons for this error:
              </Text>
            </Paragraph>
            <Paragraph>
              <ul style={{ color: '#666' }}>
                <li>The link was already used to change your password.</li>
                <li>The 24-hour window for this token has passed.</li>
                <li>The URL was copied incorrectly from your email.</li>
              </ul>
            </Paragraph>
          </div>
        </Result>
      </Card>
    </div>
  );
};

export default InvalidTokenResponse;