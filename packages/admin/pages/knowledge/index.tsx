import { Icon as LegacyIcon } from '@ant-design/compatible';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, List, Popconfirm, Select, Tooltip } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

import { KnowledgeSettingDrawer } from '@/components/KnowledgeSettingDrawer';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useToggle } from '@/hooks/useToggle';
import { AdminLayout } from '@/layout/AdminLayout';
import { KnowledgeProvider } from '@/providers/knowledge';

import style from './index.module.scss';

const GRID = {
  gutter: 16,
  xs: 1,
  SM: 2,
  MD: 4,
  lg: 4,
  xl: 4,
  xxl: 6,
};
const SEARCH_FIELDS = [
  {
    label: 'Name',
    field: 'title',
    msg: 'Please Enter The Name Of The Knowledge Base',
  },
  {
    label: 'Status',
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

const Page = () => {
  const [visible, toggleVisible] = useToggle(false);
  const [selectedBook, setSelectedBook] = useState<IKnowledge | null>(null);
  const {
    loading: getLoading,
    data: books,
    refresh,
    ...resetPagination
  } = usePagination<IKnowledge>(KnowledgeProvider.getKnowledges);
  const [updateBookApi] = useAsyncLoading(KnowledgeProvider.updateKnowledge);
  const [deleteKnowledgeApi] = useAsyncLoading(KnowledgeProvider.deleteKnowledge);

  const editBook = useCallback(
    (book) => {
      setSelectedBook(book);
      toggleVisible();
    },
    [toggleVisible]
  );

  const toggleBookStatus = useCallback(
    (book) => {
      updateBookApi(book.id, {
        status: book.status === 'draft' ? 'publish' : 'draft',
      }).then(() => {
        refresh();
      });
    },
    [updateBookApi, refresh]
  );

  const deleteBook = useCallback(
    (book) => {
      deleteKnowledgeApi(book.id).then(() => {
        refresh();
      });
    },
    [deleteKnowledgeApi, refresh]
  );

  useEffect(() => {
    if (!visible && selectedBook) {
      setSelectedBook(null);
    }
  }, [visible, selectedBook]);

  const renderBook = useCallback(
    (book: IKnowledge) => (
      <List.Item key={book.id}>
        <Card
          loading={getLoading}
          style={{ width: '100%' }}
          cover={<img className={style.cover} alt={book.title} src={book.cover} />}
          actions={[
            <Link key="edit" href={`/knowledge/editor/[id]`} as={`/knowledge/editor/` + book.id}>
              <a>
                <EditOutlined key="edit" />
              </a>
            </Link>,
            <Tooltip key="status" title={book.status === 'draft' ? 'Publish Online' : 'Set As Draft'}>
              <LegacyIcon
                onClick={() => toggleBookStatus(book)}
                type={book.status === 'draft' ? 'cloud-upload' : 'cloud-download'}
              />
            </Tooltip>,
            <SettingOutlined key="setting" onClick={() => editBook(book)} />,
            <Popconfirm
              key="delete"
              title="Confirm Deletion?"
              okText="Confirm"
              cancelText="Cancel"
              onConfirm={() => deleteBook(book)}
            >
              <DeleteOutlined key="setting" />
            </Popconfirm>,
          ]}
        >
          <Card.Meta title={book.title} description={book.summary} />
        </Card>
      </List.Item>
    ),
    [getLoading, editBook, deleteBook, toggleBookStatus]
  );

  return (
    <AdminLayout>
      <PaginationTable
        loading={getLoading}
        data={books}
        {...resetPagination}
        refresh={refresh}
        searchFields={SEARCH_FIELDS}
        rightNode={
          <Button type="primary" onClick={toggleVisible}>
            <PlusOutlined />
            New
          </Button>
        }
        customDataTable={(data) => (
          <List className={style.imgs} grid={GRID} dataSource={data} renderItem={renderBook} />
        )}
      />
      <KnowledgeSettingDrawer visible={visible} toggleVisible={toggleVisible} book={selectedBook} onOk={refresh} />
    </AdminLayout>
  );
};

export default Page;
