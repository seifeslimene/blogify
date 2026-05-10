import { Tabs } from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { AnalyticsSetting } from '@/components/Setting/AnalyticsSetting';
import { LocaleSetting } from '@/components/Setting/LocaleSetting';
import { OSSSetting } from '@/components/Setting/OSSSetting';
import { SEOSetting } from '@/components/Setting/SEOSetting';
import { SMTPSetting } from '@/components/Setting/SMTPSetting';
import { SystemSetting } from '@/components/Setting/SystemSetting';
import { useSetting } from '@/hooks/useSetting';
import { AdminLayout } from '@/layout/AdminLayout';

interface IProps {
  type: string;
}

const { TabPane } = Tabs;

const Setting: NextPage<IProps> = ({ type: defaultType }) => {
  const router = useRouter();
  const [type, setType] = useState(defaultType);
  const setting = useSetting();

  const tabs = [
    {
      label: 'System Settings',
      content: <SystemSetting setting={setting} />,
    },
    {
      label: 'International Settings',
      content: <LocaleSetting setting={setting} />,
    },
    {
      label: 'SEO Settings',
      content: <SEOSetting setting={setting} />,
    },
    {
      label: 'Statistics',
      content: <AnalyticsSetting setting={setting} />,
    },
    {
      label: 'OSS Settings',
      content: <OSSSetting setting={setting} />,
    },
    {
      label: 'SMTP Service',
      content: <SMTPSetting setting={setting} />,
    },
  ];

  return (
    <AdminLayout>
      {setting && (
        <div style={{ background: '#fff', padding: 16 }}>
          <Tabs
            activeKey={type}
            tabPosition={'left'}
            onChange={(key) => {
              setType(key);
              router.push(`/setting`, `/setting?type=` + key, {
                shallow: true,
              });
            }}
          >
            {tabs.map((tab) => {
              return (
                <TabPane tab={tab.label} key={tab.label}>
                  {tab.content}
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      )}
    </AdminLayout>
  );
};

Setting.getInitialProps = async (ctx) => {
  const { type } = ctx.query;
  return { type: '' + (type || 'System settings') };
};

export default Setting;
