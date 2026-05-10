import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';

import { useUser } from '@/hooks/useUser';

const menus = [
  {
    label: 'Personal Center',
    icon: 'user',
    path: '/ownspace',
  },
  {
    icon: 'user',
    label: 'User Management',
    path: '/user',
  },
  {
    icon: 'setting',
    label: 'System Settings',
    path: '/setting',
  },
];

const menu = () => {
  return (
    <Menu>
      {menus.map((menu) => (
        <Menu.Item key={menu.label}>
          <Link href={menu.path}>
            <a>{menu.label}</a>
          </Link>
        </Menu.Item>
      ))}
      <Menu.Item>
        <Link href="/login">
          <a>Sign Out</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export const UserInfo = () => {
  const user = useUser();

  return (
    <Dropdown overlay={menu}>
      <div>
        {user && user.avatar ? (
          <Avatar size={'small'} src={user.avatar} />
        ) : (
          <Avatar size={'small'} icon={<UserOutlined />} />
        )}
        {user ? (
          <span style={{ marginLeft: 8 }}>
            Hi, {user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.name}
          </span>
        ) : null}
      </div>
    </Dropdown>
  );
};
