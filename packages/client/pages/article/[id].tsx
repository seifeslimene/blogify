import { TagOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import { default as Router } from 'next/router';
import { useTranslations } from 'next-intl';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { ArticleRecommend } from '@/components/ArticleRecommend';
import { Comment } from '@/components/Comment';
import { ImageViewer } from '@/components/ImageViewer';
import { LocaleTime } from '@/components/LocaleTime';
import { MarkdownReader } from '@/components/MarkdownReader';
import { Toc } from '@/components/Toc';
import { GlobalContext } from '@/context/global';
import { DoubleColumnLayout } from '@/layout/DoubleColumnLayout';
import { ArticleProvider } from '@/providers/article';

import style from './index.module.scss';
const url = require('url');

interface IProps {
  article: IArticle;
}

const Article: NextPage<IProps> = ({ article }) => {
  const t = useTranslations();
  const { setting } = useContext(GlobalContext);
  const passwdRef = useRef(null);
  const [shouldCheckPassWord, setShouldCheckPassword] = useState(article && article.needPassword);
  const tocs = article && article.toc ? JSON.parse(article.toc) : [];

  // Check Article Password
  const checkPassWord = useCallback(() => {
    ArticleProvider.checkPassword(article.id, passwdRef.current).then((res) => {
      if (res.pass) {
        Object.assign(article, res);
        setShouldCheckPassword(false);
      } else {
        message.error(t('wrongPasswd'));
        setShouldCheckPassword(true);
      }
    });
  }, [t, article]);

  const back = useCallback(() => {
    Router.push('/');
  }, []);

  const checkPassWordModal = (
    <Modal
      title={t('protectedArticleMsg')}
      cancelText={t('backHome')}
      okText={t('confirm')}
      visible={shouldCheckPassWord}
      onOk={checkPassWord}
      onCancel={back}
    >
      <Form.Item label={t('passwd')}>
        <Input.Password
          onChange={(e) => {
            passwdRef.current = e.target.value;
          }}
        />
      </Form.Item>
    </Modal>
  );

  useEffect(() => {
    setShouldCheckPassword(article && article.needPassword);
  }, [article]);

  // Update Reading Volume
  useEffect(() => {
    if (!shouldCheckPassWord) {
      ArticleProvider.updateArticleViews(article.id);
    }
  }, [shouldCheckPassWord, article]);

  const Content = (
    <>
      {checkPassWordModal}
      <Helmet>
        <title>{(article.title || t('unknownTitle')) + ' | ' + setting.systemTitle}</title>
      </Helmet>
      <ImageViewer containerSelector="#js-article-wrapper">
        <article id="js-article-wrapper" className={style.articleWrap}>
          {/* S Article SEO Information */}
          {setting.systemUrl && (
            <meta itemProp="url" content={url.resolve(setting.systemUrl, `/article/${article.id}`)} />
          )}
          <meta itemProp="headline" content={article.title} />
          {article.tags && <meta itemProp="keywords" content={article.tags.map((tag) => tag.label).join(' ')} />}
          <meta itemProp="dataPublished" content={article.publishAt} />
          {article.cover && <meta itemProp="image" content={article.cover} />}
          {/* E Article SEO Information */}

          {/* S Article Cover */}
          {article.cover && (
            <div className={style.coverWrapper}>
              <img src={article.cover} alt={t('articleCover') as string} />
            </div>
          )}
          {/* E Article Cover */}

          {/* S Article Meta Information */}
          <div className={style.metaInfoWrap}>
            <h1 className={style.title}>{article.title}</h1>
            <p className={style.desc}>
              <span>
                {t('publishAt')}
                {` `}
                <LocaleTime date={article.publishAt} />
              </span>
              <span> • </span>
              <span>
                {t('readings')} {article.views}
              </span>
            </p>
          </div>
          {/* E article Meta Information */}

          {/* S Article Content */}
          <MarkdownReader content={article.html} />
          {/* E Article Content */}

          {/* S Article Footer */}
          <div className={style.footerInfoWrap}>
            {/* S Article Copyright */}
            <div className={style.copyrightInfo}>
              {t('publishAt')}
              {` `}
              <LocaleTime date={article.publishAt} /> | {t('copyrightInfo')}:{` `}
              <a href="https://creativecommons.org/licenses/by-nc/3.0/deed.en" target="_blank" rel="noreferrer">
                {t('copyrightContent')}
              </a>
            </div>
            {/* E Article Copyright */}

            {/* S Article Tag */}
            {article.tags && article.tags.length ? (
              <div className={style.tagsWrap}>
                {article.tags.map((tag) => {
                  return (
                    <div className={style.tagWrapper} key={tag.id}>
                      <div className={style.tag}>
                        <Link href={'/tag/[tag]'} as={'/tag/' + tag.value} scroll={false}>
                          <a aria-label={tag.label}>
                            <TagOutlined />
                            <span>{tag.label}</span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {/* E Article Tag */}
          </div>
          {/* E Article Footer */}
        </article>

        {/* S Article Comments */}
        {article.isCommentable && (
          <div className={style.commentWrap}>
            <p className={style.title}>{t('comment')}</p>
            <Comment key={article.id} hostId={article.id} />
          </div>
        )}
        {/* E Article Comments */}

        {/* S Recommended Articles */}
        <div className={style.recmmendArticles}>
          <p className={style.title}>{t('recommendToReading')}</p>
          <div className={style.articleContainer}>
            <ArticleRecommend articleId={article.id} needTitle={false} />
          </div>
        </div>
        {/* E Recommended Articles */}
      </ImageViewer>
    </>
  );

  const Aside = (
    <>
      <div className={'sticky'}>
        {tocs && tocs.length ? <Toc key={article.id} tocs={tocs} maxHeight={'80vh'} /> : null}
      </div>
    </>
  );
  return (
    <DoubleColumnLayout
      leftNode={Content}
      rightNode={Aside}
      likesProps={{
        defaultCount: article.likes,
        id: article.id,
        api: (id, type) => ArticleProvider.updateArticleLikes(id, type).then((res) => res.likes),
      }}
      showComment={article.isCommentable}
    />
  );
};

Article.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { article };
};

export default Article;
