import { CloseOutlined, EllipsisOutlined, FileImageOutlined } from '@ant-design/icons';
import { Editor as CodeEditor } from '@components/Editor';
import { Button, Drawer, Dropdown, Input, InputNumber, Menu, message, Modal, PageHeader } from 'antd';
import cls from 'classnames';
import { default as Router } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { useWarningOnExit } from '@/hooks/useWarningOnExit';
import { PageProvider } from '@/providers/page';
import { resolveUrl } from '@/utils';

import style from './index.module.scss';

interface IProps {
  id?: string | number;
  page?: IPage;
}

const FormItem = ({ label, content }) => {
  return (
    <div className={style.formItem}>
      <span>{label}</span>
      <div>{content}</div>
    </div>
  );
};

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

export const PageEditor: React.FC<IProps> = ({ id: defaultId, page: defaultPage = {} }) => {
  const setting = useSetting();
  const isCreate = !defaultId; // Whether it is newly created at the beginning
  const [id, setId] = useState(defaultId);
  const [page, setPage] = useState<Partial<IPage>>(defaultPage);
  const [pageDrawerVisible, togglePageDrawerVisible] = useToggle(false);
  const [fileDrawerVisible, toggleFileDrawerVisible] = useToggle(false);
  const [hasSaved, toggleHasSaved] = useToggle(false);

  const patchPage = useMemo(
    () => (key) => (value) => {
      if (value.target) {
        value = value.target.value;
      }
      setPage((page) => {
        if (key === 'path') {
          value = value.replace('/', '');
        }
        page[key] = value;
        return page;
      });
    },
    []
  );

  const save = useCallback(() => {
    if (!page.name) {
      message.warn('Please Enter Page Name');
      return;
    }
    page.status = 'draft';
    const promise = id ? PageProvider.updatePage(id, page) : PageProvider.addPage(page);
    return promise.then((res) => {
      toggleHasSaved(true);
      setId(res.id);
      message.success('Page Saved As Draft');
    });
  }, [page, id, toggleHasSaved]);

  const publish = useCallback(() => {
    let canPublish = true;
    void [
      ['name', 'Please Enter The Page Name'],
      ['path', 'Please Enter The Page Path'],
      ['content', 'Please Enter Page Content'],
    ].forEach(([key, msg]) => {
      if (!page[key]) {
        message.warn(msg);
        canPublish = false;
      }
    });
    if (!canPublish) {
      page.name && togglePageDrawerVisible();
      return;
    }
    page.status = 'publish';
    if (id) {
      PageProvider.updatePage(id, page).then((res) => {
        toggleHasSaved(true);
        setId(res.id);
        message.success('The Page Has Been Updated');
      });
    } else {
      PageProvider.addPage(page).then((res) => {
        toggleHasSaved(true);
        setId(res.id);
        message.success('Page Published');
      });
    }
  }, [page, id, togglePageDrawerVisible, toggleHasSaved]);

  const preview = useCallback(() => {
    if (id) {
      window.open(resolveUrl(setting.systemUrl, '/page/' + id));
    } else {
      message.warn('Please Save First');
    }
  }, [id, setting.systemUrl]);

  const deletePage = useCallback(() => {
    if (!id) {
      return;
    }
    const handle = () => {
      PageProvider.deletePage(id).then(() => {
        toggleHasSaved(true);
        message.success('Page Deleted Successfully');
        Router.push('/page');
      });
    };
    Modal.confirm({
      title: 'Confirm Deletion?',
      content: 'Once Content Is Deleted, It Cannot Be Restored.',
      onOk: handle,
      okText: 'Confirm',
      cancelText: 'Cancel',
      transitionName: '',
      maskTransitionName: '',
    });
  }, [id, toggleHasSaved]);

  const goback = useCallback(() => {
    Router.push('/page');
  }, []);

  useEffect(() => {
    if (isCreate && id) {
      Router.replace('/page/editor/' + id);
    }
  }, [isCreate, id]);

  useWarningOnExit(!hasSaved, () =>
    window.confirm('Confirm To Close? If There Are Any Changes To The Content, Please Save It First!')
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>{id ? `Edit Page ${page.name ? '-' + page.name : ''}` : 'Create New Page'}</title>
      </Helmet>
      <header className={style.header}>
        <PageHeader
          style={{
            borderBottom: '1px solid rgb(235, 237, 240)',
            background: '#fff',
          }}
          backIcon={<Button size="small" icon={<CloseOutlined />} />}
          onBack={goback}
          title={
            <Input
              style={{ width: 300 }}
              placeholder="Please Enter Page Name"
              defaultValue={page.name}
              onChange={patchPage('name')}
            />
          }
          extra={[
            <Button key="publish" type="primary" onClick={publish}>
              Publish
            </Button>,
            <Dropdown
              key="more"
              overlay={
                <Menu>
                  <Menu.Item disabled={isCreate} key="preview" onClick={preview}>
                    Check
                  </Menu.Item>
                  <Menu.Item key="setting" onClick={togglePageDrawerVisible}>
                    Setup
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="draft" onClick={save}>
                    Save Draft
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item disabled={isCreate} key="delete" onClick={deletePage}>
                    Delete
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<EllipsisOutlined />} type="link"></Button>
            </Dropdown>,
          ]}
        />
      </header>
      <main className={cls(style.main)}>
        <CodeEditor
          defaultValue={page.content}
          onChange={({ value, html, toc }) => {
            patchPage('content')(value);
            patchPage('html')(html);
            patchPage('toc')(toc);
          }}
        />
      </main>
      <Drawer title={'Page Properties'} width={480} visible={pageDrawerVisible} onClose={togglePageDrawerVisible}>
        <FormItem
          label="Cover"
          content={
            <Input
              placeholder="Please Enter Page Cover"
              addonAfter={<FileImageOutlined onClick={toggleFileDrawerVisible} />}
              defaultValue={page.cover}
              onChange={patchPage('cover')}
            />
          }
        />
        <FormItem
          label="Path"
          content={
            <Input placeholder="Please Configure The Page Path" defaultValue={page.path} onChange={patchPage('path')} />
          }
        />
        <FormItem
          label="Order"
          content={<InputNumber defaultValue={page.order || 0} onChange={patchPage('order')} />}
        />
        <div style={drawerFooterStyle}>
          <Button type="primary" onClick={togglePageDrawerVisible}>
            Confirm
          </Button>
        </div>
      </Drawer>
      <FileSelectDrawer
        isCopy={true}
        closeAfterClick={true}
        visible={fileDrawerVisible}
        onClose={toggleFileDrawerVisible}
      />
    </div>
  );
};
