import { Alert, Button, Card, Drawer, List } from 'antd';
import React, { useCallback, useRef } from 'react';
import Viewer from 'viewerjs';

import { PaginationTable } from '@/components/PaginationTable';
import { Upload } from '@/components/Upload';
import { usePagination } from '@/hooks/usePagination';
import { FileProvider } from '@/providers/file';
import { copy } from '@/utils/copy';

import style from './index.module.scss';

const { Meta } = Card;
let viewer = null;

const SEARCH_FIELDS = [
  {
    label: 'Filename',
    field: 'originalname',
    msg: 'Please Enter The Filename',
  },
  {
    label: 'File Type',
    field: 'type',
    msg: 'Please Enter The File Type',
  },
];

const GRID = {
  gutter: 16,
  xs: 1,
  SM: 2,
  MD: 4,
  lg: 4,
  xl: 4,
  xxl: 6,
};

interface IFileProps {
  isCopy?: boolean;
  visible: boolean;
  closeAfterClick?: boolean;
  onClose: () => void;
  onChange?: (arg) => void;
}

export const FileSelectDrawer: React.FC<IFileProps> = ({
  visible,
  isCopy = false,
  closeAfterClick = false,
  onClose,
  onChange,
}) => {
  const ref = useRef();
  const { loading, data: files, refresh, ...resetPagination } = usePagination<IFile>(FileProvider.getFiles);

  const previewImage = useCallback((e) => {
    e.stopPropagation();
    if (!viewer) {
      viewer = new Viewer(ref.current, { inline: false });
    } else {
      viewer.update();
    }
  }, []);

  const clickImage = useCallback(
    (file) => {
      isCopy && copy(file.url);
      onChange && onChange(file.url);
      closeAfterClick && onClose();
    },
    [isCopy, onChange, closeAfterClick, onClose]
  );

  const renderList = useCallback(
    (data) => {
      const renderItem = (file: IFile) => (
        <List.Item key={file.id}>
          <Card
            hoverable={true}
            cover={
              <div className={style.preview} onClick={previewImage}>
                <img alt={file.originalname} src={file.url} />
              </div>
            }
            onClick={() => clickImage(file)}
          >
            <Meta title={file.originalname} />
          </Card>
        </List.Item>
      );
      return <List className={style.imgs} grid={GRID} dataSource={data} renderItem={renderItem} />;
    },
    [clickImage, previewImage]
  );

  return (
    <Drawer width={786} placement="right" title={'File selection'} closable={true} onClose={onClose} visible={visible}>
      {isCopy && (
        <div style={{ marginBottom: 16 }}>
          <Alert message="Click On The Card To Copy The Link, Click On The Image To See A Larger Image" type="info" />
        </div>
      )}
      <div ref={ref}>
        <PaginationTable
          loading={loading}
          data={files}
          {...resetPagination}
          refresh={refresh}
          searchFields={SEARCH_FIELDS}
          rightNode={
            <Upload onOK={refresh} useDragger={false}>
              <Button>Upload file</Button>
            </Upload>
          }
          customDataTable={renderList}
        />
      </div>
    </Drawer>
  );
};
