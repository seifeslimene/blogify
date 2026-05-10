import { PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, message, Modal, Popconfirm, Select, Spin, Tag } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { ViewChart } from '@/components/ViewChart';
import { getRandomColor } from '@/constants';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { AdminLayout } from '@/layout/AdminLayout';
import { ArticleProvider } from '@/providers/article';
import { CategoryProvider } from '@/providers/category';
import { ViewProvider } from '@/providers/view';
import { resolveUrl } from '@/utils';

import style from './index.module.scss';

let updateLoadingMessage = null;
const SCROLL = { x: 1380 };
const SEARCH_FIELDS = [
  {
    label: 'Title',
    field: 'title',
    msg: 'Please Enter The Article Title',
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
const COMMON_COLUMNS = [
  {
    title: 'State',
    dataIndex: 'status',
    width: 120,
    elipsis: true,
    key: 'status',
    render: (status) => {
      const isDraft = status === 'draft';
      return <Badge color={isDraft ? 'gold' : 'green'} text={isDraft ? 'Draft' : 'Published'} />;
    },
  },
  {
    title: 'Classification',
    key: 'category',
    dataIndex: 'category',
    width: 150,
    render: (category) =>
      category ? (
        <span>
          <Tag color={getRandomColor(category.label)} key={category.value}>
            {category.label}
          </Tag>
        </span>
      ) : null,
  },
  {
    title: 'Label',
    key: 'tags',
    dataIndex: 'tags',
    width: 190,
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          return (
            <Tag color={getRandomColor(tag.label)} key={tag.label}>
              {tag.label}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Reading Volume',
    dataIndex: 'views',
    key: 'views',
    width: 110,
    render: (views) => (
      <Badge count={views} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#52c41a' }} />
    ),
  },
  {
    title: 'Like to Count',
    dataIndex: 'likes',
    key: 'likes',
    width: 110,
    render: (val) => (
      <Badge count={val} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#eb2f96' }} />
    ),
  },
  {
    title: 'Release Time',
    dataIndex: 'publishAt',
    key: 'publishAt',
    width: 180,
    render: (date) => <LocaleTime date={date} />,
  },
];

const Article: NextPage = () => {
  const setting = useSetting();
  const [modalVisible, toggleModalVisible] = useToggle(false);
  const [views, setViews] = useState<IView[]>([]);
  const [categorys, setCategorys] = useState<Array<ICategory>>([]);
  const {
    loading: listLoading,
    data: articles,
    refresh,
    ...resetPagination
  } = usePagination<IArticle>(ArticleProvider.getArticles);
  const [updateApi, updateLoading] = useAsyncLoading(ArticleProvider.updateArticle);
  const [deleteAPi, deleteLoading] = useAsyncLoading(ArticleProvider.deleteArticle);
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
        Promise.all(ids.map((id) => deleteAPi(id))).then(() => {
          message.success('Successful Operation');
          refresh();
          resetSelectedRows && resetSelectedRows();
        });
      };
    },
    [deleteAPi, refresh]
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
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    ellipsis: true,
    width: 200,
    render: (text, record) => (
      <a href={resolveUrl(setting.systemUrl, `/article/${record.id}`)} target="_blank" rel="noreferrer">
        {text}
      </a>
    ),
  };

  const actionColumn = (resetSelectedRows) => ({
    title: 'Operate',
    key: 'action',
    fixed: 'right',
    render: (_, record: IArticle) => (
      <span className={style.action}>
        <Link href={`/article/editor/[id]`} as={`/article/editor/` + record.id}>
          <a>
            <Button type="link" size={'small'}>
              Edit
            </Button>
          </a>
        </Link>
        <Divider type="vertical" />
        <Button type="link" size={'small'} onClick={updateAction(record, 'isRecommended')}>
          {record.isRecommended ? 'Undo First Focus' : 'First Focus Recommendation'}
        </Button>
        <Divider type="vertical" />
        <Button
          type="link"
          size={'small'}
          onClick={() => getViews(resolveUrl(setting.systemUrl, '/article/' + record.id))}
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
    ),
  });

  useEffect(() => {
    CategoryProvider.getCategory().then((res) => setCategorys(res));
  }, []);

  useEffect(() => {
    if (updateLoading) {
      updateLoadingMessage = message.loading('In operation...', 0);
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
          data={articles}
          columns={(resetSelectedRows) => [titleColumn, ...COMMON_COLUMNS, actionColumn(resetSelectedRows)]}
          {...resetPagination}
          refresh={refresh}
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
                  Draft
                </Button>
                <Button
                  disabled={!hasSelected}
                  style={{ marginRight: 8 }}
                  onClick={updateAction(selectedRows, 'isRecommended', true)}
                >
                  First Focus Recommendation
                </Button>
                <Button
                  disabled={!hasSelected}
                  style={{ marginRight: 8 }}
                  onClick={updateAction(selectedRows, 'isRecommended', false)}
                >
                  Cancel First Focus
                </Button>
                <Popconfirm
                  title="Confirm deletion?"
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
          rightNode={
            <Link href={'/article/editor'}>
              <a>
                <Button type="primary">
                  <PlusOutlined />
                  New
                </Button>
              </a>
            </Link>
          }
          scroll={SCROLL}
          searchFields={[
            ...SEARCH_FIELDS,
            {
              label: 'Classification',
              field: 'category',
              children: (
                <Select style={{ width: 180 }}>
                  {categorys.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      {t.label}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
          ]}
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

export default Article;
