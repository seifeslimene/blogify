import { Form } from '@ant-design/compatible';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { SettingProvider } from '@/providers/setting';

export const AnalyticsSetting = ({ setting }) => {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(null);

  useEffect(() => {
    setGoogleAnalyticsId((setting && setting.googleAnalyticsId) || null);
  }, [setting]);

  const save = () => {
    const data = {
      googleAnalyticsId,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('Saved successfully');
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Google Analytics">
        <Input
          placeholder="Please Enter Google Analytics ID"
          value={googleAnalyticsId}
          onChange={(e) => {
            setGoogleAnalyticsId(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        Save
      </Button>
    </Form>
  );
};
