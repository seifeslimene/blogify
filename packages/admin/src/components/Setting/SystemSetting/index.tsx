import { Form } from '@ant-design/compatible';
import { FileImageOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { SettingProvider } from '@/providers/setting';

export const SystemSetting = ({ setting }) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('logo');
  const [systemUrl, setSystemUrl] = useState(null);
  const [systemTitle, setSystemTitle] = useState(null);
  const [systemBg, setSystemBg] = useState(null);
  const [systemLogo, setSystemLogo] = useState(null);
  const [systemFavicon, setSystemFavicon] = useState(null);
  const [systemFooterInfo, setSystemFooterInfo] = useState(null);
  const [adminSystemUrl, setAdminSystemUrl] = useState(null);

  useEffect(() => {
    setSystemUrl((setting && setting.systemUrl) || null);
    setSystemTitle((setting && setting.systemTitle) || null);
    setSystemBg((setting && setting.systemBg) || null);
    setSystemLogo((setting && setting.systemLogo) || null);
    setSystemFavicon((setting && setting.systemFavicon) || null);
    setSystemFooterInfo((setting && setting.systemFooterInfo) || null);
    setAdminSystemUrl((setting && setting.adminSystemUrl) || null);
  }, [setting]);

  const save = () => {
    const data = {
      systemUrl,
      systemTitle,
      systemBg,
      systemLogo,
      systemFavicon,
      systemFooterInfo,
      adminSystemUrl,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('Saved Successfully');
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label=" System address">
        <Input
          placeholder="Please Enter The System Address"
          value={systemUrl}
          onChange={(e) => {
            setSystemUrl(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Backend address">
        <Input
          placeholder="Please Enter The Backend Address"
          value={adminSystemUrl}
          onChange={(e) => {
            setAdminSystemUrl(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="System Title">
        <Input
          placeholder="Please Enter A System Title, Which Will Be Displayed As Head Title"
          value={systemTitle}
          onChange={(e) => {
            setSystemTitle(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Global Background">
        <Input
          placeholder="Please Enter Global Background Link Or Select File"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('bg');
                setVisible(true);
              }}
            />
          }
          value={systemBg}
          onChange={(e) => {
            setSystemBg(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Logo">
        <Input
          placeholder="Please Enter A Logo Link Or Select A File, Or Enter Html"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('logo');
                setVisible(true);
              }}
            />
          }
          value={systemLogo}
          onChange={(e) => {
            setSystemLogo(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Favicon">
        <Input
          placeholder="Please Enter Favicon Link Or Select File"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('favicon');
                setVisible(true);
              }}
            />
          }
          value={systemFavicon}
          onChange={(e) => {
            setSystemFavicon(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Footer Information">
        <Input.TextArea
          placeholder="Please Enter Footer Information"
          rows={8}
          value={systemFooterInfo}
          onChange={(e) => {
            setSystemFooterInfo(e.target.value);
          }}
        />
      </Form.Item>
      <FileSelectDrawer
        visible={visible}
        closeAfterClick={true}
        onClose={() => setVisible(false)}
        onChange={(url) => {
          if (mode === 'logo') {
            setSystemLogo(url);
          } else if (mode === 'bg') {
            setSystemBg(url);
          } else {
            setSystemFavicon(url);
          }
        }}
      />
      <Button type="primary" onClick={save}>
        Save
      </Button>
    </Form>
  );
};
