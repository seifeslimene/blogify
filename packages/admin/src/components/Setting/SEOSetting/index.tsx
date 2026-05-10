import { Form } from '@ant-design/compatible';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { SettingProvider } from '@/providers/setting';

export const SEOSetting = ({ setting }) => {
  const [seoKeyword, setSeoKeyword] = useState(null);
  const [seoDesc, setSeoDesc] = useState(null);

  useEffect(() => {
    setSeoKeyword((setting && setting.seoKeyword) || null);
    setSeoDesc((setting && setting.seoDesc) || null);
  }, [setting]);

  const save = () => {
    const data = {
      seoKeyword,
      seoDesc,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('Saved successfully');
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Keywords">
        <Input
          placeholder="Please Enter Keywords, Separated By Spaces"
          value={seoKeyword}
          onChange={(e) => {
            setSeoKeyword(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          placeholder="Please Enter Description Information"
          rows={6}
          value={seoDesc}
          onChange={(e) => {
            setSeoDesc(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        Save
      </Button>
    </Form>
  );
};
