import { Form } from '@ant-design/compatible';
import { Button, Input, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { SettingProvider } from '@/providers/setting';
import { SMTPProvider } from '@/providers/smtp';

export const SMTPSetting = ({ setting }) => {
  const [smtpHost, setsmtpHost] = useState(null);
  const [smtpPort, setsmtpPort] = useState(null);
  const [smtpUser, setsmtpUser] = useState(null);
  const [smtpPass, setsmtpPass] = useState(null);
  const [smtpFromUser, setSmtpFromUser] = useState(null);

  useEffect(() => {
    setsmtpHost((setting && setting.smtpHost) || null);
    setsmtpPort((setting && setting.smtpPort) || null);
    setsmtpUser((setting && setting.smtpUser) || null);
    setsmtpPass((setting && setting.smtpPass) || null);
    setSmtpFromUser((setting && setting.smtpFromUser) || null);
  }, [setting]);

  const save = () => {
    const data = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFromUser,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('Saved Successfully');
    });
  };

  const test = useCallback(() => {
    SMTPProvider.testSendMail(smtpFromUser)
      .then(() => {
        message.success('Mail Sent Successfully');
      })
      .catch(() => {
        message.error('Email Sending Failed');
      });
  }, [smtpFromUser]);

  return (
    <Form layout="vertical">
      <Form.Item label="SMTP Address">
        <Input
          placeholder="Please Enter SMTP"
          value={smtpHost}
          onChange={(e) => {
            setsmtpHost(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP Port (Forces SSL Connection)">
        <Input
          placeholder="Please Enter SMTP Port"
          value={smtpPort}
          onChange={(e) => {
            setsmtpPort(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP User">
        <Input
          placeholder="Please Enter SMTP User"
          value={smtpUser}
          onChange={(e) => {
            setsmtpUser(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP Password">
        <Input
          placeholder="It Could Also Be An Authorization Code"
          value={smtpPass}
          onChange={(e) => {
            setsmtpPass(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Sender">
        <Input
          placeholder="Please Input The Correct Email Address"
          value={smtpFromUser}
          onChange={(e) => {
            setSmtpFromUser(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        Save
      </Button>
      <Button style={{ marginLeft: 16 }} onClick={test}>
        Test
      </Button>
    </Form>
  );
};
