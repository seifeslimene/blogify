import { Button, message, Popconfirm, Select } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';

import { CommentAction } from '@/components/comment/CommentAction';
import { CommentArticle } from '@/components/comment/CommentArticle';
import { CommentContent } from '@/components/comment/CommentContent';
import { CommentHTML } from '@/components/comment/CommentHTML';
import { CommentStatus } from '@/components/comment/CommentStatus';
import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { CommentProvider } from '@/providers/comment';

let updateLoadingMessage = null;
const SCROLL = { x: 1440 };
const SEARCH_FIELDS = [
  {
    label: 'Title',
    field: 'name',
    msg: 'Please Enter Your Title',
  },
  {
    label: 'Email',
    field: 'email',
    msg: 'Please Enter Contact Information',
  },
  {
    label: 'Status',
    field: 'pass',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: 'Passed', value: 1 },
          { label: 'Failed', value: 0 },
        ].map((t) => {
          return (
            <Select.Option key={t.label} value={t.value as number}>
              {t.label}
            </Select.Option>
          );
        })}
      </Select>
    ),
  },
];
const COMMON_COLUMNS = [
  {
    title: 'Status',
    dataIndex: 'pass',
    key: 'pass',
    fixed: 'left',
    width: 100,
    render: (_, record) => <CommentStatus comment={record} />,
  },
  {
    title: 'Title',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Contact Information',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Original Content',
    dataIndex: 'content',
    key: 'content',
    width: 160,
    render: (_, record) => <CommentContent comment={record} />,
  },
  {
    title: 'HTML Content',
    dataIndex: 'html',
    key: 'html',
    width: 160,
    render: (_, record) => <CommentHTML comment={record} />,
  },

  {
    title: 'Manage Articles',
    dataIndex: 'url',
    key: 'url',
    width: 100,
    render: (_, record) => {
      return <CommentArticle comment={record} />;
    },
  },
  {
    title: 'Creation Time',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 200,
    render: (date) => <LocaleTime date={date} />,
  },
];

const Comment = () => {
  const { loading, data: comments, refresh, ...resetPagination } = usePagination<IComment>(CommentProvider.getComments);
  const [updateApi, updateLoading] = useAsyncLoading(CommentProvider.updateComment);
  const [deleteApi, deleteLoading] = useAsyncLoading(CommentProvider.deleteComment);

  const updateAction = useCallback(
    (articles, key, value = null) => {
      if (!Array.isArray(articles)) {
        articles = [articles];
      }
      return () =>
        Promise.all(
          articles.map((article) => updateApi(article.id, { [key]: value !== null ? value : !article[key] }))
        ).then(() => {
          message.success('Operation Successful');
          refresh();
        });
    },
    [updateApi, refresh]
  );

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

  const parentCommentColumn = useMemo(
    () => ({
      title: 'Parent Comment',
      dataIndex: 'parentCommentId',
      key: 'parentCommentId',
      width: 100,
      render: (id) => {
        const target = comments.find((c) => c.id === id);
        return (target && target.name) || 'None';
      },
    }),
    [comments]
  );

  const actionColumn = useCallback(
    (resetSelectedRows) => ({
      title: 'Operation',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <CommentAction
          comment={record}
          refresh={() => {
            resetSelectedRows();
            refresh();
          }}
        />
      ),
    }),
    [refresh]
  );

  useEffect(() => {
    if (updateLoading) {
      updateLoadingMessage = message.loading('Operation In Progress...', 0);
    } else {
      updateLoadingMessage && updateLoadingMessage();
    }
  }, [updateLoading]);

  return (
    <AdminLayout>
      <PaginationTable
        showSelection={true}
        loading={loading}
        data={comments}
        columns={(resetSelectedRows) => [...COMMON_COLUMNS, parentCommentColumn, actionColumn(resetSelectedRows)]}
        refresh={refresh}
        {...resetPagination}
        renderLeftNode={({ hasSelected, selectedRowKeys, selectedRows, resetSelectedRows }) =>
          hasSelected ? (
            <>
              <Button
                disabled={!hasSelected}
                style={{ marginRight: 8 }}
                onClick={updateAction(selectedRows, 'pass', true)}
              >
                Accept
              </Button>
              <Button
                disabled={!hasSelected}
                style={{ marginRight: 8 }}
                onClick={updateAction(selectedRows, 'status', false)}
              >
                Reject
              </Button>
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
            </>
          ) : null
        }
        scroll={SCROLL}
        searchFields={SEARCH_FIELDS}
      />
    </AdminLayout>
  );
};

export default Comment;
