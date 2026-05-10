import { Badge, Button, message, Popconfirm } from 'antd';
import { NextPage } from 'next';
import React, { useCallback } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { SearchProvider } from '@/providers/search';

import style from './index.module.scss';

const COMMON_COLUMNS = [
  {
    title: 'Search Term',
    dataIndex: 'keyword',
    key: 'keyword',
  },
  {
    title: 'Popularity',
    dataIndex: 'count',
    key: 'count',
    render: (views) => (
      <Badge count={views} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#52c41a' }} />
    ),
  },
  {
    title: 'Search Time',
    dataIndex: 'createAt',
    key: 'createAt',
    render: (date) => <LocaleTime date={date} />,
  },
];

const SEARCH_FIELDS = [
  {
    label: 'Type',
    field: 'type',
    msg: 'Please Enter Search Type',
  },
  {
    label: 'Search Term',
    field: 'keyword',
    msg: 'Please Enter Search Terms',
  },
  {
    label: 'Popularity',
    field: 'count',
    msg: 'Please Enter Search Volume',
  },
];

const Search: NextPage = () => {
  const { loading, data, refresh, ...resetPagination } = usePagination<ISearch>(SearchProvider.getRecords);
  const [deleteApi, deleteLoading] = useAsyncLoading(SearchProvider.deleteRecord);

  const deleteAction = useCallback(
    (ids, resetSelectedRows = null) => {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return () => {
        Promise.all(ids.map((id) => deleteApi(id))).then(() => {
          message.success('Successful Operation');
          resetSelectedRows && resetSelectedRows();
          refresh();
        });
      };
    },
    [deleteApi, refresh]
  );

  const actionColumn = (resetSelectedRows) => ({
    title: 'Operate',
    key: 'action',
    render: (_, record) => (
      <span className={style.action}>
        <Popconfirm
          title="Are You Sure You Want To Delete This Search History?"
          onConfirm={deleteAction(record.id, resetSelectedRows)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <a>Delete</a>
        </Popconfirm>
      </span>
    ),
  });

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
          searchFields={SEARCH_FIELDS}
        />
      </div>
    </AdminLayout>
  );
};

export default Search;
