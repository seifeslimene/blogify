import { Button, Popover } from 'antd';
import React from 'react';

export const CommentContent = ({ comment }) => {
  return (
    <span>
      <Popover
        title={'Comment Details - Original Content'}
        content={
          <div
            className="markdown"
            style={{ maxWidth: 320 }}
            dangerouslySetInnerHTML={{
              __html: comment && comment.content,
            }}
          ></div>
        }
      >
        <Button type="link" style={{ paddingLeft: 0 }}>
          View content
        </Button>
      </Popover>
    </span>
  );
};
