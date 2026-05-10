import { InboxOutlined } from '@ant-design/icons';
import { message, Spin, Upload as AntdUpload } from 'antd';
import React, { useState } from 'react';

import { FileProvider } from '@/providers/file';

export const Upload = ({ onChange = null, onOK = null, style = {}, useDragger = true, children = null }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '',
    showUploadList: false,
    beforeUpload(file) {
      setLoading(true);
      FileProvider.uploadFile(file)
        .then((res) => {
          setLoading(false);
          message.success('Upload Successful');
          onChange && onChange(res.url);
          onOK && onOK();
        })
        .catch(() => {
          setLoading(false);
        });
      return Promise.reject(new Error('Cancel'));
    },
  };

  const Wrap = useDragger ? AntdUpload.Dragger : AntdUpload;

  return (
    <Spin tip="File Uploading..." spinning={loading}>
      <Wrap {...uploadProps} style={style}>
        {children || (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click to select the file or drag the file here</p>
            <p className="ant-upload-hint">
              The file will be uploaded to OSS. If it is not configured, please configure it first
            </p>
          </>
        )}
      </Wrap>
    </Spin>
  );
};
