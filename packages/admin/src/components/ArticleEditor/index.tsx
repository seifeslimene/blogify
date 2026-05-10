import { CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Editor as MDEditor } from '@components/Editor';
import { Button, Dropdown, Input, Menu, message, Modal, PageHeader, Popconfirm } from 'antd';
import cls from 'classnames';
import { default as Router } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { useWarningOnExit } from '@/hooks/useWarningOnExit';
import { ArticleProvider } from '@/providers/article';
import { resolveUrl } from '@/utils';

import { ArticleSettingDrawer } from './ArticleSettingDrawer';
import style from './index.module.scss';

interface IProps {
  id?: string | number;
  article?: IArticle;
}

const REQUIRED_ARTICLE_ATTRS = [
  ['title', 'Please Enter The Article Title'],
  ['content', 'Please Enter The Article Content'],
];

// Side effect: the category passed to the server needs to be an id
const transformCategory = (article) => {
  if (article.category && article.category.id) {
    article.category = article.category.id;
  }
};
const transformTags = (article) => {
  if (Array.isArray(article.tags)) {
    try {
      article.tags = (article.tags as ITag[]).map((t) => t.id).join(',');
    } catch (e) {
      console.error('Error transforming tags', e);
    }
  }
};

export const ArticleEditor: React.FC<IProps> = ({ id: defaultId, article: defaultArticle = { title: '' } }) => {
  const isCreate = !defaultId; // Whether it is newly created at the beginning
  const setting = useSetting();
  const [id, setId] = useState(defaultId);
  const [article, setArticle] = useState<Partial<IArticle>>(defaultArticle);
  const [settingDrawerVisible, toggleSettingDrawerVisible] = useToggle(false);
  const [hasSaved, toggleHasSaved] = useToggle(false);

  const patchArticle = useMemo(
    () => (key) => (value) => {
      if (value.target) {
        value = value.target.value;
      }
      setArticle((article) => {
        article[key] = value;
        return article;
      });
    },
    []
  );

  // Verify necessary attributes of the article
  const check = useCallback(() => {
    let canPublish = true;
    let errorMsg = null;
    REQUIRED_ARTICLE_ATTRS.forEach(([key, msg]) => {
      if (!article[key]) {
        errorMsg = msg;
        canPublish = false;
      }
    });
    if (!canPublish) {
      return Promise.reject(new Error(errorMsg));
    }
    return Promise.resolve();
  }, [article]);

  // Open Publish Drawer
  const openSetting = useCallback(() => {
    check()
      .then(() => {
        toggleSettingDrawerVisible();
      })
      .catch((err) => {
        message.warn(err.message);
      });
  }, [check, toggleSettingDrawerVisible]);

  const saveSetting = useCallback(
    (setting) => {
      toggleSettingDrawerVisible();
      Object.assign(article, setting);
    },
    [article, toggleSettingDrawerVisible]
  );

  // Save Draft Or Publish Online
  const saveOrPublish = useCallback(
    (patch = {}) => {
      const data = { ...article, ...patch };
      return check()
        .then(() => {
          transformCategory(data);
          transformTags(data);
          const promise = !isCreate ? ArticleProvider.updateArticle(id, data) : ArticleProvider.addArticle(data);
          return promise.then((res) => {
            setId(res.id);
            toggleHasSaved(true);
            message.success(
              res.status === 'draft' ? 'The Article Has Been Saved As A Draft' : 'The Article Has Been Published'
            );
          });
        })
        .catch((err) => {
          message.warn(err.message);
          return Promise.reject(err);
        });
    },
    [article, isCreate, check, id, toggleHasSaved]
  );

  const saveDraft = useCallback(() => {
    return saveOrPublish({ status: 'draft' });
  }, [saveOrPublish]);

  const publish = useCallback(() => {
    return saveOrPublish({ status: 'publish' });
  }, [saveOrPublish]);

  // Preview article
  const preview = useCallback(() => {
    if (id) {
      if (!setting.systemUrl) {
        message.error(
          'The Frontend Address Has Not Been Configured And The Preview Address Cannot Be Constructed Correctly.'
        );
        return;
      }
      window.open(resolveUrl(setting.systemUrl, '/article/' + id));
    } else {
      message.warn('Please Save First');
    }
  }, [id, setting.systemUrl]);

  const deleteArticle = useCallback(() => {
    if (!id) {
      return;
    }
    const handle = () => {
      ArticleProvider.deleteArticle(id).then(() => {
        toggleHasSaved(true);
        message.success('Article Deleted Successfully');
        Router.push('/article');
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
    Router.push('/article');
  }, []);

  useEffect(() => {
    if (isCreate && id) {
      Router.replace('/article/editor/' + id);
    }
  }, [id, isCreate]);

  useWarningOnExit(!hasSaved, () =>
    window.confirm('Confirm To Close? If There Are Any Changes To The Content, Please Save It First!')
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>{id ? `Edit Article ${article.title ? '-' + article.title : ''}` : 'Create New Article'}</title>
      </Helmet>
      <header className={style.header}>
        <PageHeader
          backIcon={<Button size="small" icon={<CloseOutlined />} />}
          style={{
            borderBottom: '1px solid rgb(235, 237, 240)',
          }}
          onBack={goback}
          title={
            <Input
              style={{ width: 300 }}
              placeholder="Please Enter The Article Title"
              defaultValue={article.title}
              onChange={patchArticle('title')}
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
                  <Menu.Item key="view" disabled={isCreate} onClick={preview}>
                    Check
                  </Menu.Item>
                  <Menu.Item key="setting" onClick={openSetting}>
                    Setup
                  </Menu.Item>
                  <Menu.Divider key="divide-1" />
                  <Menu.Item key="draft" onClick={saveDraft}>
                    Save Draft
                  </Menu.Item>
                  <Menu.Divider key="divide-2" />
                  <Menu.Item key="delete" disabled={isCreate} onClick={deleteArticle}>
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
        <MDEditor
          defaultValue={article.content}
          onChange={({ value, html, toc }) => {
            patchArticle('content')(value);
            patchArticle('html')(html);
            patchArticle('toc')(toc);
          }}
        />
      </main>
      <ArticleSettingDrawer
        article={article as IArticle}
        visible={settingDrawerVisible}
        onClose={toggleSettingDrawerVisible}
        onChange={saveSetting}
      />
    </div>
  );
};
