import { Badge, Button, message, Popconfirm } from 'antd';
import { NextPage } from 'next';
import React, { useCallback } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { ViewProvider } from '@/providers/view';

import style from './index.module.scss';

const SCROLL = { x: 1440 };
const COMMON_COLUMNS = [
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    width: 200,
    fixed: 'left',
    render: (url) => (
      <a className={style.link} href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
    ),
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    width: 160,
  },
  { title: 'Browser', dataIndex: 'browser', key: 'browser' },
  {
    title: 'Kernel',
    dataIndex: 'engine',
    key: 'engine',
  },
  {
    title: 'Operating System',
    dataIndex: 'os',
    key: 'os',
  },
  {
    title: 'Equipment',
    dataIndex: 'device',
    key: 'device',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (address) => {
      return address || '-';
    },
  },
  {
    title: 'Visits',
    dataIndex: 'count',
    key: 'count',
    width: 120,
    render: (views) => (
      <Badge count={views} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#52c41a' }} />
    ),
  },
  {
    title: 'Access Time',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 200,
    render: (date) => <LocaleTime date={date} />,
  },
];
const SEARCH_FIELDS = [
  {
    label: 'IP',
    field: 'ip',
    msg: 'Please Enter IP Address',
  },
  {
    label: 'UA',
    field: 'userAgent',
    msg: 'Please Enter User Agent',
  },
  {
    label: 'URL',
    field: 'url',
    msg: 'Please Enter URL',
  },
  {
    label: 'Address',
    field: 'address',
    msg: 'Please Enter Address',
  },
  {
    label: 'Browser',
    field: 'browser',
    msg: 'Please Enter Your Browser',
  },
  {
    label: 'Kernel',
    field: 'engine',
    msg: 'Please Enter The Kernel',
  },
  {
    label: 'OS',
    field: 'os',
    msg: 'Please Enter Operating System',
  },
  {
    label: 'Equipment',
    field: 'device',
    msg: 'Please Enter The Device',
  },
];

const Views: NextPage = () => {
  const { loading, data, refresh, ...resetPagination } = usePagination<IView>(ViewProvider.getViews);
  const [deleteApi, deleteLoading] = useAsyncLoading(ViewProvider.deleteView);
  const deleteAction = useCallback(
    (ids, resetSelectedRows = null) => {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return () => {
        Promise.all(ids.map((id) => deleteApi(id))).then(() => {
          message.success('Operation Successful');
          resetSelectedRows && resetSelectedRows();
          refresh();
        });
      };
    },
    [deleteApi, refresh]
  );

  const actionColumn = (resetSelectedRows) => ({
    title: 'Operation',
    key: 'action',
    fixed: 'right',
    render: (_, record) => (
      <span className={style.action}>
        <Popconfirm
          title="Are You Sure You Want To Delete This Access?"
          onConfirm={deleteAction(record.id, resetSelectedRows)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <a>Delete</a>
        </Popconfirm>
      </span>
    ),
  });

  // debugger;

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={data}
          columns={(resetSelectedRows) => [...COMMON_COLUMNS, actionColumn(resetSelectedRows)]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRowKeys, resetSelectedRows }) =>
            hasSelected ? (
              <Popconfirm
                title="Confirm Deletion?"
                onConfirm={deleteAction(selectedRowKeys, resetSelectedRows)}
                okText="Confirm"
                cancelText="Cancel"
              >
                <Button disabled={!hasSelected} loading={deleteLoading} danger={true}>
                  Delete
                </Button>
              </Popconfirm>
            ) : null
          }
          scroll={SCROLL}
          searchFields={SEARCH_FIELDS}
        />
      </div>
    </AdminLayout>
  );
};

export default Views;
