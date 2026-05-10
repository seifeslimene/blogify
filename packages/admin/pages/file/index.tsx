import { Alert, Button, Card, Col, Drawer, List, message, Popconfirm, Row } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Viewer from 'viewerjs';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { Upload } from '@/components/Upload';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { AdminLayout } from '@/layout/AdminLayout';
import { FileProvider } from '@/providers/file';
import { formatFileSize } from '@/utils';
import { copy } from '@/utils/copy';

import style from './index.module.scss';

const { Meta } = Card;

const drawerFooterStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  borderTop: '1px solid #e8e8e8',
  padding: '10px 16px',
  textAlign: 'right',
  left: 0,
  background: '#fff',
  borderRadius: '0 0 4px 4px',
};

const DescriptionItem = ({ title, content }) => (
  <div className={style.description}>
    <p>{title}:</p>
    <div>{content}</div>
  </div>
);

const SEARCH_FIELDS = [
  {
    label: 'Filename',
    field: 'originalname',
    msg: 'Please Enter The File Name',
  },
  {
    label: 'File Type',
    field: 'type',
    msg: 'Please Enter The File Type',
  },
];

const GRID = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 4,
  xxl: 6,
};

let viewer = null;

const File: NextPage = () => {
  const ref = useRef();
  const setting = useSetting();
  const [visible, toggleVisible] = useToggle(false);
  const [currentFile, setCurrentFile] = useState<IFile | null>(null);
  const { loading, data: files, refresh, ...resetPagination } = usePagination<IFile>(FileProvider.getFiles);
  const [deleteApi, deleteLoading] = useAsyncLoading(FileProvider.deleteFile);
  const isOSSSettingFullFiled = useMemo(() => setting && setting.oss, [setting]);

  const deleteAction = useCallback(
    (ids, resetSelectedRows = null) => {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return () => {
        Promise.all(ids.map((id) => deleteApi(id))).then(() => {
          message.success('Operation Successful');
          resetSelectedRows && resetSelectedRows();
          setCurrentFile(null);
          toggleVisible();
          refresh();
        });
      };
    },
    [deleteApi, toggleVisible, refresh]
  );

  const renderList = useCallback(
    (data) => {
      const renderItem = (file: IFile) => {
        const onClick = (file) => () => {
          setCurrentFile(file);
          toggleVisible();
          Promise.resolve().then(() => {
            if (!viewer) {
              viewer = new Viewer(ref.current, { inline: false });
            } else {
              viewer.update();
            }
          });
        };

        return (
          <List.Item key={file.id}>
            <Card
              hoverable={true}
              cover={
                <div className={style.preview}>
                  <img alt={file.originalname} src={file.url} />
                </div>
              }
              onClick={onClick(file)}
            >
              <Meta
                title={file.originalname}
                description={
                  <>
                    upload to
                    <LocaleTime date={file.createAt} />
                  </>
                }
              />
            </Card>
          </List.Item>
        );
      };
      return <List className={style.imgs} grid={GRID} dataSource={data} renderItem={renderItem} />;
    },
    [toggleVisible]
  );

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        {!isOSSSettingFullFiled ? (
          <div style={{ marginBottom: 24 }}>
            <Alert
              message={
                <span>
                  The System Detects That <strong>Alibaba Cloud OSS Configuration</strong> Is Not Complete.{' '}
                  <Link href="/setting?type=OSS%20settings">
                    <a>Click Me To Complete Immediately</a>
                  </Link>
                </span>
              }
              type="warning"
            />
          </div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <Upload onOK={refresh} />
          </div>
        )}
        <PaginationTable
          loading={loading}
          data={files}
          refresh={refresh}
          {...resetPagination}
          searchFields={SEARCH_FIELDS}
          customDataTable={renderList}
        />
        <Drawer
          width={640}
          placement="right"
          title={'File information'}
          closable={true}
          onClose={toggleVisible}
          visible={visible}
        >
          <div ref={ref} className={style.previewContainer}>
            <img alt={currentFile && currentFile.originalname} src={currentFile && currentFile.url} />
          </div>
          <Row>
            <Col span={24}>
              <DescriptionItem title="File name" content={currentFile && currentFile.originalname} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title="Storage path" content={currentFile && currentFile.filename} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="File Type" content={currentFile && currentFile.type} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="File size" content={formatFileSize((currentFile && currentFile.size) || 0)} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Visit link"
                content={
                  <>
                    <div
                      className={style.urlContainer}
                      onClick={() => {
                        copy(currentFile && currentFile.url);
                      }}
                    >
                      {currentFile && currentFile.url}
                    </div>
                    <Button
                      type="link"
                      onClick={() => {
                        copy(currentFile && currentFile.url);
                      }}
                    >
                      copy
                    </Button>
                  </>
                }
              />
            </Col>
          </Row>
          <div style={drawerFooterStyle}>
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={toggleVisible}
            >
              Closure
            </Button>
            <Popconfirm
              placement="topRight"
              title="Confirm To Delete This File?"
              onConfirm={deleteAction(currentFile && currentFile.id)}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button danger={true} loading={deleteLoading}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </Drawer>
      </div>
    </AdminLayout>
  );
};

export default File;
