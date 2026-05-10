import { Form } from '@ant-design/compatible';
import { Button, Card, Col, Input, message, Popconfirm, Row } from 'antd';
import cls from 'classnames';
import { NextPage } from 'next';
import React, { useCallback, useMemo, useState } from 'react';

import { AdminLayout } from '@/layout/AdminLayout';
import { TagProvider } from '@/providers/tag';

import style from './index.module.scss';

interface ITagProps {
  tags: ITag[];
}

const TagPage: NextPage<ITagProps> = ({ tags: defaultTags = [] }) => {
  const [tags, setTags] = useState(defaultTags);
  const [mode, setMode] = useState('create');
  const [currentTag, setCurrentTag] = useState(null);
  const [label, setLabel] = useState(null);
  const [value, setValue] = useState(null);

  const isCreateMode = useMemo(() => mode === 'create', [mode]);

  const getTags = useCallback(() => {
    TagProvider.getTags().then((tags) => {
      setTags(tags);
    });
  }, []);

  const reset = useCallback(() => {
    setMode('create');
    setCurrentTag(null);
    setLabel(null);
    setValue(null);
  }, []);

  const addTag = useCallback(
    (data) => {
      if (!data || !data.label) {
        return;
      }

      TagProvider.addTag(data).then(() => {
        message.success('Label Added Successfully');
        reset();
        getTags();
      });
    },
    [reset, getTags]
  );

  const updateTag = useCallback(
    (id, data) => {
      if (!data || !data.label) {
        return;
      }

      TagProvider.updateTag(id, data).then(() => {
        message.success('Update label successfully');
        reset();
        getTags();
      });
    },
    [reset, getTags]
  );

  const deleteTag = useCallback(
    (id) => {
      TagProvider.deleteTag(id).then(() => {
        message.success('Delete tag successfully');
        reset();
        getTags();
      });
    },
    [reset, getTags]
  );

  return (
    <AdminLayout>
      <Row gutter={16} className={style.wrapper}>
        <Col xs={24} sm={24} md={9}>
          <Card title={isCreateMode ? 'Add Label' : 'Manage Label'} bordered={true}>
            <Form.Item>
              <Input
                value={label}
                placeholder={'Enter Label Name'}
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <Form.Item>
              <Input
                value={value}
                placeholder={'Enter Label Value (Please Enter English, Used As Routing)'}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <div className={cls(style.btns, isCreateMode ? false : style.isEdit)}>
              {isCreateMode ? (
                <Button type="primary" onClick={() => addTag({ label, value })}>
                  Save
                </Button>
              ) : (
                <>
                  <Button.Group>
                    <Button
                      type="primary"
                      onClick={() =>
                        updateTag(currentTag.id, {
                          label,
                          value,
                        })
                      }
                    >
                      Renew
                    </Button>
                    <Button type="dashed" onClick={() => reset()}>
                      Return To Add
                    </Button>
                  </Button.Group>
                  <Popconfirm
                    title="Are You Sure You Want To Delete This Tag?"
                    onConfirm={() => deleteTag(currentTag.id)}
                    okText="Confirm"
                    cancelText="Cancel"
                  >
                    <Button danger={true}>Delete</Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={15}>
          <Card title="All Tags" bordered={true}>
            <ul className={style.list}>
              {tags.map((d) => (
                <li
                  key={d.id}
                  className={cls(style.item)}
                  onClick={() => {
                    setMode('edit');
                    setCurrentTag(d);
                    setLabel(d.label);
                    setValue(d.value);
                  }}
                >
                  <a key={d.id} className={style.tag}>
                    <span>{d.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

TagPage.getInitialProps = async () => {
  const tags = await TagProvider.getTags();
  return { tags };
};

export default TagPage;
