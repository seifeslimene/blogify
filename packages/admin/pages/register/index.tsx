import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Button, Col, Input, Modal, Row } from 'antd';
import Link from 'next/link';
import { default as Router } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';

import { Svg } from '@/assets/RegisterSvg';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

type IProps = FormComponentProps;

const _Register: React.FC<IProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two Passwords Are Inconsistent');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          setLoading(true);
          UserProvider.register(values)
            .then(() => {
              Modal.confirm({
                title: 'Registration Successful',
                content: 'Do You Want To Jump To Login?',
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk() {
                  Router.push('/login');
                },
                onCancel() {
                  setLoading(false);
                  form.resetFields();
                },
                transitionName: '',
                maskTransitionName: '',
              });
            })
            .catch(() => setLoading(false));
        }
      });
    },
    [form]
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>Guest Registration</title>
      </Helmet>
      <Row className={style.container}>
        <Col xs={0} sm={0} md={12}>
          <Svg />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ width: '100%' }}>
            <h2>Guest Registration</h2>
            <br />
            <Form layout="horizontal" onSubmit={submit}>
              <Form.Item label="Account">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please Enter User Name!' }],
                })(<Input autoComplete={'off'} placeholder="Please Enter User Name" />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please Enter Your Password!' },

                    {
                      validator: validateToNextPassword,
                    },
                  ],
                })(<Input autoComplete={'off'} type="password" placeholder="Please Enter Your Password" />)}
              </Form.Item>
              <Form.Item label="Confirm">
                {getFieldDecorator('confirm', {
                  rules: [
                    { required: true, message: 'Please Enter Your Password Again!' },

                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                })(<Input autoComplete={'off'} type="password" placeholder="Please Enter Password Again" />)}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: '100%', marginBottom: '10px' }}
                  loading={loading}
                  disabled={loading}
                >
                  Register
                </Button>
                Or{' '}
                <Link href="/login">
                  <a style={{ color: '#0188fb' }}>Go To Login</a>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <ul className={style.bubbles}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <li key={idx}></li>
        ))}
      </ul>
    </div>
  );
};

export default Form.create<IProps>({ name: 'register' })(_Register);
