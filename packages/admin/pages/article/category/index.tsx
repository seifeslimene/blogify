import { Form } from '@ant-design/compatible';
import { Button, Card, Col, Input, message, Popconfirm, Row } from 'antd';
import cls from 'classnames';
import { NextPage } from 'next';
import React, { useCallback, useMemo, useState } from 'react';

import { AdminLayout } from '@/layout/AdminLayout';
import { CategoryProvider } from '@/providers/category';

import style from './index.module.scss';

interface IProps {
  data: ICategory[];
}

const Page: NextPage<IProps> = ({ data: defaultData = [] }) => {
  const [data, setData] = useState(defaultData);
  const [mode, setMode] = useState('create');
  const [current, setCurrent] = useState(null);
  const [label, setLabel] = useState(null);
  const [value, setValue] = useState(null);

  const isCreateMode = useMemo(() => mode === 'create', [mode]);

  const getData = useCallback(() => {
    CategoryProvider.getCategory().then((res) => {
      setData(res);
    });
  }, []);

  const reset = useCallback(() => {
    setMode('create');
    setCurrent(null);
    setLabel(null);
    setValue(null);
  }, []);

  const addTag = useCallback(
    (data) => {
      if (!data || !data.label) {
        return;
      }

      CategoryProvider.add(data).then(() => {
        message.success('Category Successfully Added');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  const updateTag = useCallback(
    (id, data) => {
      if (!data || !data.label) {
        return;
      }

      CategoryProvider.update(id, data).then(() => {
        message.success('Classification Successfully Updated');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  const deleteTag = useCallback(
    (id) => {
      CategoryProvider.delete(id).then(() => {
        message.success('Category Successfully Deleted');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  return (
    <AdminLayout>
      <Row gutter={16} className={style.wrapper}>
        <Col xs={24} sm={24} md={9}>
          <Card title={isCreateMode ? 'Add Category' : 'Manage Category'} bordered={true}>
            <Form.Item>
              <Input
                value={label}
                placeholder={'Enter Category Name'}
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <Form.Item>
              <Input
                value={value}
                placeholder={'Enter The Classification Value (Please Enter English, Used As Routing)'}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <div className={cls(style.btns, isCreateMode ? false : style.isEdit)}>
              {isCreateMode ? (
                <Button type="primary" onClick={() => addTag({ label, value })}>
                  save
                </Button>
              ) : (
                <>
                  <Button.Group>
                    <Button
                      type="primary"
                      onClick={() =>
                        updateTag(current.id, {
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
                    title="Confirm To Delete This Category?"
                    onConfirm={() => deleteTag(current.id)}
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
          <Card title="All Categories" bordered={true}>
            <ul className={style.list}>
              {data.map((d) => (
                <li
                  key={d.id}
                  className={cls(style.item)}
                  onClick={() => {
                    setMode('edit');
                    setCurrent(d);
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

Page.getInitialProps = async () => {
  const data = await CategoryProvider.getCategory();
  return { data };
};

export default Page;
