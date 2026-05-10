import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import Link from 'next/link';
import { default as Router } from 'next/router';
import React from 'react';

export const ResourceCreate = ({ collapsed = false }) => {
  const menu = (
    <Menu>
      <Menu.Item onClick={() => Router.push('/article/editor')}>
        <Link href={'/article/editor'}>
          <a>
            <span>Create New Article</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item onClick={() => Router.push('/page/editor')}>
        <Link href={'/page/editor'}>
          <a>
            <span>Create New Page</span>
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <Button style={{ width: '100%' }} type="primary" size="large" icon={<PlusOutlined />}>
        {!collapsed && 'New'}
      </Button>
    </Dropdown>
  );
};
