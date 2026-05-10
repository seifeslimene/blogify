import { message } from 'antd';
import axios from 'axios';

import { toLogin } from '@/utils/login';

export const httpProvider = axios.create({
  baseURL: process.env.SERVER_API_URL,
  timeout: 60000,
});

httpProvider.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  () => {
    throw new Error('Error Initiating Request');
  }
);

httpProvider.interceptors.response.use(
  (data) => {
    if (data.status && +data.status === 200 && data.data.status === 'error') {
      typeof window !== 'undefined' && message.error({ message: data.data.msg });
      return null;
    }
    const res = data.data;
    if (!res.success) {
      message.error(res.msg);
      return null;
    }
    return res.data;
  },
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;
      const isClient = typeof window !== 'undefined';

      switch (status) {
        case 504:
        case 404:
          isClient && message.error('Server Exception');
          break;

        case 403:
          isClient && message.warn('Visitors Are Not Authorized To Perform This Operation');
          break;

        case 401:
          isClient && message.info('Please Log In Again');
          toLogin();
          break;

        default:
          isClient && message.error((err.response && err.response.data && err.response.data.msg) || 'Unknown Error!');
      }
    }

    return Promise.reject(err);
  }
);
