import { PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, message, Modal, Popconfirm, Select, Spin } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { ViewChart } from '@/components/ViewChart';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { AdminLayout } from '@/layout/AdminLayout';
import { PageProvider } from '@/providers/page';
import { ViewProvider } from '@/providers/view';
import { resolveUrl } from '@/utils';

import style from './index.module.scss';

let updateLoadingMessage = null;

const columns = [
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: 'Reading Volume',
    dataIndex: 'views',
    key: 'views',
    render: (views) => (
      <Badge count={views} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#52c41a' }} />
    ),
  },
  {
    title: 'State',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const isDraft = status === 'draft';
      return <Badge color={isDraft ? 'gold' : 'green'} text={isDraft ? 'Draft' : 'Published'} />;
    },
  },
  {
    title: 'Release Time',
    dataIndex: 'publishAt',
    key: 'publishAt',
    render: (date) => <LocaleTime date={date} />,
  },
];
const SEARCH_FIELDS = [
  {
    label: 'Name',
    field: 'name',
    msg: 'Please Enter Page Name',
  },
  {
    label: 'Path',
    field: 'path',
    msg: 'Please Enter The Page Path',
  },
  {
    label: 'State',
    field: 'status',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: 'Published', value: 'publish' },
          { label: 'Draft', value: 'draft' },
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
];

const Page: NextPage = () => {
  const setting = useSetting();
  const { loading: listLoading, data, refresh, ...resetPagination } = usePagination<IPage>(PageProvider.getPages);
  const [modalVisible, toggleModalVisible] = useToggle(false);
  const [views, setViews] = useState<IView[]>([]);
  const [updateApi, updateLoading] = useAsyncLoading(PageProvider.updatePage);
  const [deleteApi, deleteLoading] = useAsyncLoading(PageProvider.deletePage);
  const [getViewsByUrlApi, getViewsLoading] = useAsyncLoading(ViewProvider.getViewsByUrl);

  const updateAction = useCallback(
    (articles, key, value = null) => {
      if (!Array.isArray(articles)) {
        articles = [articles];
      }
      return () =>
        Promise.all(
          articles.map((article) => updateApi(article.id, { [key]: value !== null ? value : !article[key] }))
        ).then(() => {
          message.success('Successful Operation');
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
          message.success('Successful Operation');
          resetSelectedRows && resetSelectedRows();
          refresh();
        })
      };
    },
    [deleteApi, refresh]
  );

  const getViews = useCallback(
    (url) => {
      toggleModalVisible();
      getViewsByUrlApi(url).then((res) => {
        setViews(res);
      });
    },
    [toggleModalVisible, getViewsByUrlApi]
  );

  const closeViewModal = useCallback(() => {
    toggleModalVisible();
    setViews([]);
  }, [toggleModalVisible]);

  const titleColumn = {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <a href={resolveUrl(setting.systemUrl || '', `/page/${record.path}`)} target="_blank" rel="noreferrer">
        {text}
      </a>
    ),
  };

  const actionColumn = (resetSelectedRows) => ({
    title: 'Operate',
    key: 'action',
    render: (_, record) => {
      const isDraft = record.status === 'draft';

      return (
        <span className={style.action}>
          <Link href={`/page/editor/[id]`} as={`/page/editor/` + record.id}>
            <a>
              <Button type="link" size={'small'}>
                Edit
              </Button>
            </a>
          </Link>
          <Divider type="vertical" />
          {isDraft ? (
            <Button type="link" size={'small'} onClick={updateAction(record, 'status', 'publish')}>
              Publish
            </Button>
          ) : (
            <Button type="link" size={'small'} onClick={updateAction(record, 'status', 'draft')}>
              Offline
            </Button>
          )}
          <Divider type="vertical" />
          <Button
            type="link"
            size={'small'}
            onClick={() => getViews(resolveUrl(setting.systemUrl, '/page/' + record.id))}
          >
            View Visit
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are You Sure You Want To Delete This Article?"
            onConfirm={deleteAction(record.id, resetSelectedRows)}
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button type="link" size={'small'}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      );
    },
  });

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
          loading={listLoading}
          data={data}
          columns={(resetSelectedRows) => [titleColumn, ...columns, actionColumn(resetSelectedRows)]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRowKeys, selectedRows, resetSelectedRows }) =>
            hasSelected ? (
              <>
                <Button
                  disabled={!hasSelected}
                  style={{ marginRight: 8 }}
                  onClick={updateAction(selectedRows, 'status', 'publish')}
                >
                  Publish
                </Button>
                <Button
                  disabled={!hasSelected}
                  style={{ marginRight: 8 }}
                  onClick={updateAction(selectedRows, 'status', 'draft')}
                >
                  Offline
                </Button>
                <Popconfirm
                  title="Confirm Deletion?"
                  onConfirm={deleteAction(selectedRowKeys, resetSelectedRows)}
                  okText="Confirm"
                  cancelText="Cancel"
                >
                  <Button disabled={!hasSelected} loading={false} danger={true}>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ) : null
          }
          rightNode={
            <Link href={'/page/editor'}>
              <a>
                <Button type="primary">
                  <PlusOutlined />
                  New
                </Button>
              </a>
            </Link>
          }
          searchFields={SEARCH_FIELDS}
        />
        <Modal
          title="Statistics"
          visible={modalVisible}
          width={640}
          onCancel={closeViewModal}
          maskClosable={false}
          footer={null}
          transitionName={''}
          maskTransitionName={''}
        >
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={getViewsLoading}>
              <ViewChart data={views} />
            </Spin>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Page;
