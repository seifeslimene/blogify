import { Button, Popover } from 'antd';
import React from 'react';

export const CommentHTML = ({ comment }) => {
  return (
    <span>
      <Popover
        title={'Comment details - HTML Content'}
        content={
          <div
            className="markdown"
            style={{ maxWidth: 320 }}
            dangerouslySetInnerHTML={{
              __html: comment && comment.html,
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
