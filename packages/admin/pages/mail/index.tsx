import { Alert, Button, message, Modal, Popconfirm } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useSetting } from '@/hooks/useSetting';
import { AdminLayout } from '@/layout/AdminLayout';
import { MailProvider } from '@/providers/mail';

import style from './index.module.scss';

const SCROLL = { x: 1440 };
const SEARCH_FIELDS = [
  {
    label: 'Sender',
    field: 'from',
    msg: 'Please Enter Sender',
  },
  {
    label: 'Recipient',
    field: 'to',
    msg: 'Please Enter Recipient',
  },
  {
    label: 'Theme',
    field: 'subject',
    msg: 'Please Enter A Subject',
  },
];
const COMMON_COLUMNS = [
  {
    title: 'Sender',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: 'Recipient',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'Theme',
    dataIndex: 'subject',
    key: 'subject',
  },
];
const TIME_COLUMN = {
  title: 'Send Time',
  dataIndex: 'createAt',
  key: 'createAt',
  render: (date) => <LocaleTime date={date} />,
};

const Mail: NextPage = () => {
  const setting = useSetting();
  const { loading, data: mails, refresh, ...resetPagination } = usePagination<IMail>(MailProvider.getMails);
  const [deleteApi, deleteLoading] = useAsyncLoading(MailProvider.deleteMail);
  const [selectedMail, setSelectedMail] = useState(null);
  const isSmtpSettingFullfilled = useMemo(() => {
    return (
      setting &&
      setting.smtpHost &&
      setting.smtpPort &&
      setting.smtpUser &&
      setting.smtpFromUser &&
      setting.smtpFromUser
    );
  }, [setting]);

  const deleteAction = useCallback(
    (ids, resetSelectedRows = null) => {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return () => {
        Promise.all(ids.map((id) => deleteApi(id))).then(() => {
          message.success('Successful operation');
          resetSelectedRows && resetSelectedRows();
          refresh();
        });
      };
    },
    [deleteApi, refresh]
  );

  const contentColumn = [
    {
      title: 'Content',
      dataIndex: 'html',
      key: 'html',
      render: (_, record) => (
        <Button
          type="link"
          style={{ paddingLeft: 0 }}
          onClick={() => {
            setSelectedMail(record);
          }}
        >
          Click To View
        </Button>
      ),
    },
  ];

  const actionColumn = (resetSelectedRows) => ({
    title: 'Operate',
    key: 'action',
    render: (_, record) => (
      <span className={style.action}>
        <Popconfirm
          title="Are You Sure You Want To Delete This Email?"
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
        {!isSmtpSettingFullfilled ? (
          <div style={{ marginBottom: 24 }}>
            <Alert
              message={
                <span>
                  The System Detects That The <strong>SMTP Configuration</strong> Is Incomplete And Cannot Provide Email
                  Notification When Comments Are Received.{' '}
                  <Link href="/setting?type=SMTP%20service">
                    <a>Click Me To Complete Immediately</a>
                  </Link>
                </span>
              }
              type="warning"
            />
          </div>
        ) : null}
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={mails}
          columns={(resetSelectedRows) => [
            ...COMMON_COLUMNS,
            contentColumn,
            TIME_COLUMN,
            actionColumn(resetSelectedRows),
          ]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRowKeys, resetSelectedRows }) =>
            hasSelected ? (
              <Popconfirm
                title="confirm deletion?"
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
        <Modal
          title={'Send Content'}
          visible={selectedMail}
          footer={null}
          width={786 + 48}
          onCancel={() => {
            setSelectedMail(null);
          }}
          transitionName={''}
          maskTransitionName={''}
        >
          <div
            className="markdown"
            style={{ overflow: 'auto !important' }}
            dangerouslySetInnerHTML={{
              __html: selectedMail && selectedMail.html,
            }}
          ></div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Mail;
