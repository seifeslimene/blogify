import {
  Alert,
  Card,
  Col,
  List,
  Row,
  Typography,
  // Empty
} from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

import { CommentAction } from '@/components/comment/CommentAction';
import { CommentArticle } from '@/components/comment/CommentArticle';
import { CommentContent } from '@/components/comment/CommentContent';
import { CommentStatus } from '@/components/comment/CommentStatus';
import { useSetting } from '@/hooks/useSetting';
import { useUser } from '@/hooks/useUser';
import { AdminLayout } from '@/layout/AdminLayout';
import { ArticleProvider } from '@/providers/article';
import { CommentProvider } from '@/providers/comment';

import style from './index.module.scss';

const { Title, Paragraph } = Typography;

interface IHomeProps {
  articles: IArticle[];
  comments: IComment[];
}

const actions = [
  {
    name: 'Article Management',
    url: '/article',
  },
  {
    name: 'Comment Management',
    url: '/comment',
  },
  {
    name: 'File Management',
    url: '/file',
  },
  {
    name: 'User Management',
    url: '/user',
  },
  {
    name: 'Access Management',
    url: '/view',
  },
  {
    name: 'System Settings',
    url: '/setting?type=System Settings',
  },
];
const pageSize = 6;

const Home: NextPage<IHomeProps> = ({ articles = [], comments: defaultComments = [] }) => {
  const setting = useSetting();
  const user = useUser();
  const [comments, setComments] = useState<IComment[]>(defaultComments);

  const getComments = useCallback(() => {
    return CommentProvider.getComments({ page: 1, pageSize }).then((res) => {
      setComments(res[0]);
      return res;
    });
  }, []);

  return (
    <AdminLayout
      headerAppender={
        <Typography>
          <Title> Hello，{user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.name}</Title>
          <Paragraph>Your Role: {user.role === 'admin' ? 'Administrator' : 'Visitor'}</Paragraph>
        </Typography>
      }
    >
      {!setting || !setting.systemUrl ? (
        <div style={{ marginBottom: 24 }}>
          <Alert
            message={
              <span>
                System Detected <strong>System Configuration</strong> Not Perfection,
                <Link href="/setting?type=System settings">
                  <a> Click Me To Complete It mmediately</a>
                </Link>
              </span>
            }
            type="warning"
          />
        </div>
      ) : null}
      <Card title="Quick Navigation" bordered={false} bodyStyle={{ padding: 0 }}>
        <Row>
          {actions.map((action) => {
            return (
              <Col
                key={action.url}
                span={4}
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                }}
              >
                <Link href={action.url}>
                  <a className={style.recentArticleItem}>
                    <span>{action.name}</span>
                  </a>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Card>
      <Card
        title="Latest Articles"
        bordered={false}
        style={{ marginTop: 24 }}
        bodyStyle={{ padding: 0 }}
        extra={
          <Link href="/article">
            <a>
              <span>All Articles</span>
            </a>
          </Link>
        }
      >
        {articles.map((article) => {
          return (
            <Card.Grid
              key={article.id}
              style={{
                width: '33.3%',
                textAlign: 'center',
              }}
              hoverable={true}
            >
              <Link href={`/article/editor/[id]`} as={`/article/editor/` + article.id}>
                <a className={style.recentArticleItem}>
                  <img width={120} alt="Article cover" src={article.cover} />
                  <p className={style.title}>{article.title}</p>
                </a>
              </Link>
            </Card.Grid>
          );
        })}
      </Card>
      <Card
        title="Latest Comment"
        style={{ marginTop: 24 }}
        bordered={false}
        extra={
          <Link href="/comment">
            <a>
              <span>All Comments</span>
            </a>
          </Link>
        }
      >
        <List
          // locale={{
          //   emptyText: <Empty description="No Data" />,
          // }}
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              key={comment.id}
              actions={[<CommentAction key="action" comment={comment} refresh={getComments} />]}
            >
              <span>{comment.name}</span> Exist <CommentArticle comment={comment} /> Comment{' '}
              <CommentContent comment={comment} />
              <CommentStatus comment={comment} />
            </List.Item>
          )}
        />
      </Card>
    </AdminLayout>
  );
};

Home.getInitialProps = async () => {
  const [articles, comments] = await Promise.all([
    ArticleProvider.getArticles({ page: 1, pageSize }),
    CommentProvider.getComments({ page: 1, pageSize }),
  ]);

  return {
    articles: articles[0],
    comments: comments[0],
  };
};

export default Home;
