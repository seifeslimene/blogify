import { Modal } from 'antd';

export const confirm = () => {
  return new Promise((resolve, reject) => {
    return Modal.confirm({
      title: 'Content Recovery',
      content: 'The System Has Detected The Last Content Cache. Do You Want To Restore The Content?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        resolve(null);
      },
      onCancel: () => {
        reject(new Error('Canceled'));
      },
      transitionName: '',
      maskTransitionName: '',
    });
  });
};
