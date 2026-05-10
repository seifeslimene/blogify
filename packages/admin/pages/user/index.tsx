import { Badge, Button, Divider, message, Select } from 'antd';
import { NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

let updateLoadingMessage = null;
const COMMON_COLUMNS = [
  {
    title: 'Account',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
  },
  {
    title: 'Mail',
    dataIndex: 'email',
    key: 'mail',
    width: '20%',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => {
      return role === 'admin' ? 'Admin' : 'Guest';
    },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type) => {
      return type === 'normal' ? 'Normal' : '';
    },
  },
  {
    title: 'State',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const isLocked = status === 'locked';
      return <Badge color={isLocked ? 'gold' : 'green'} text={isLocked ? 'Locked ' : 'Available'} />;
    },
  },
  {
    title: 'Registration Date',
    dataIndex: 'createAt',
    key: 'createAt',
    render: (date) => <LocaleTime date={date} />,
  },
];
const SEARCH_FIELDS = [
  {
    label: 'Account',
    field: 'name',
    msg: 'Please Enter User Account',
  },
  {
    label: 'Mail',
    field: 'email',
    msg: 'Please Enter Your Account Email',
  },
  {
    label: 'Role',
    field: 'role',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: 'Administrator', value: 'admin' },
          { label: 'Visitor', value: 'visitor' },
        ].map((t) => {
          return (
            <Select.Option key={t.label} value={t.value}>
              {t.label}
            </Select.Option>
          );
        })}
      </Select>
    ),
  },
  {
    label: 'State',
    field: 'status',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: 'Locked', value: 'locked' },
          { label: 'Available', value: 'active' },
        ].map((t) => {
          return (
            <Select.Option key={t.label} value={t.value}>
              {t.label}
            </Select.Option>
          );
        })}
      </Select>
    ),
  },
  {
    label: 'Type',
    field: 'type',
    msg: 'Please Enter User Type',
  },
];

const Page: NextPage = () => {
  const { loading, data, refresh, ...resetPagination } = usePagination<IUser>(UserProvider.getUsers);
  const [updateApi, updateLoading] = useAsyncLoading(UserProvider.update);

  const updateAction = useCallback(
    (users, key, value = null) => {
      if (!Array.isArray(users)) {
        users = [users];
      }
      return () =>
        Promise.all(users.map((user) => updateApi({ ...user, [key]: value !== null ? value : !user[key] }))).then(
          () => {
            message.success('Successful Operation');
            refresh();
          }
        );
    },
    [updateApi, refresh]
  );

  const actionColumn = {
    title: 'Operate',
    key: 'action',
    render: (_, record) => {
      const isLocked = record.status === 'locked';
      const isAdmin = record.role === 'admin';

      return (
        <span className={style.action}>
          {isLocked ? (
            <a onClick={updateAction(record, 'status', 'active')}>Enable</a>
          ) : (
            <a onClick={updateAction(record, 'status', 'locked')}>Disable</a>
          )}
          <Divider type="vertical" />
          {isAdmin ? (
            <a onClick={updateAction(record, 'role', 'visitor')}>Deauthorize</a>
          ) : (
            <a onClick={updateAction(record, 'role', 'admin')}>Authorize</a>
          )}
        </span>
      );
    },
  };

  useEffect(() => {
    if (updateLoading) {
      updateLoadingMessage = message.loading('In Operation...', 0);
    } else {
      updateLoadingMessage && updateLoadingMessage();
    }
  }, [updateLoading]);

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={data}
          columns={[...COMMON_COLUMNS, actionColumn]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRows }) =>
            hasSelected ? (
              <>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'status', 'active')}
                >
                  Enable
                </Button>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'status', 'locked')}
                >
                  Disable
                </Button>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'role', 'visitor')}
                >
                  Deauthorize
                </Button>
                <Button disabled={!hasSelected} onClick={updateAction(selectedRows, 'role', 'admin')}>
                  Authorize
                </Button>
              </>
            ) : null
          }
          searchFields={SEARCH_FIELDS}
        />
      </div>
    </AdminLayout>
  );
};

export default Page;
