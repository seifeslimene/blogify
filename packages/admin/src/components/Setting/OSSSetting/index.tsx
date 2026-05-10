import { Form } from '@ant-design/compatible';
import { Alert, Button, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { JsonEditor } from '@/components/JsonEditor';
import { SettingProvider } from '@/providers/setting';
import { safeJsonParse } from '@/utils/json';

export const OSSSetting = ({ setting }) => {
  const [oss, setOss] = useState({});

  useEffect(() => {
    setOss(safeJsonParse(setting.oss));
  }, [setting.oss]);

  const onChange = useCallback((value) => {
    setOss(value);
  }, []);

  const save = useCallback(() => {
    const data = {
      oss: JSON.stringify(oss),
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('Saved Successfully');
    });
  }, [oss]);

  return (
    <Form layout="vertical">
      <Alert
        message="Illustrate"
        description={`Please Enter Your OSS Configuration In The Editor And Add The Type Field To Distinguish \r\n {"type": "aliyun", "accessKeyId": "", "accessKeySecret": "", "bucket": "", "https": true, "region": ""}`}
        type="info"
        showIcon={true}
        style={{ marginBottom: '1rem' }}
      />
      <JsonEditor
        value={oss}
        onChange={onChange}
        style={{
          height: '400px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          marginBottom: 24,
        }}
      />
      <Button type="primary" onClick={save}>
        Save
      </Button>
    </Form>
  );
};
