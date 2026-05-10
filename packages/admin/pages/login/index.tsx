import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Button, Col, Input, Row } from 'antd';
import Link from 'next/link';
import { default as Router } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { Svg } from '@/assets/LoginSvg';
import { GlobalContext } from '@/context/global';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

type ILoginProps = FormComponentProps;

const _Login: React.FC<ILoginProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  const globalContext = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          setLoading(true);
          UserProvider.login(values)
            .then((userInfo) => {
              localStorage.setItem('token', userInfo.token);
              setLoading(false);
              globalContext.setUser(userInfo);
              globalContext.getSetting();
              Router.push((Router.query.redirect as string) || '/');
            })
            .catch(() => setLoading(false));
        }
      });
    },
    [form, globalContext]
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>System Login</title>
      </Helmet>
      <Row className={style.container}>
        <Col xs={0} sm={0} md={12}>
          <Svg />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ width: '100%', fontFamily: 'arial' }}>
            <h2>System Login</h2>
            <br />
            <Form layout="horizontal" onSubmit={submit}>
              <Form.Item label="Account">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please Enter User Name!' }],
                })(<Input placeholder="Please Enter User Name" />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please Enter Your Password!' }],
                })(<Input type="password" placeholder="Please Enter Your Password" />)}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%', marginBottom: '10px' }}
                  loading={loading}
                  disabled={loading}
                >
                  Log In
                </Button>
                Or{' '}
                <Link href="/register">
                  <a style={{ color: '#0188fb' }}>Registered User</a>
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

export default Form.create<ILoginProps>({ name: 'login' })(_Login);
