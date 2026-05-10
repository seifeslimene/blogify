import { Divider, Input, message, Modal, notification, Popconfirm } from 'antd';
import React, { useCallback, useState } from 'react';

import { useSetting } from '@/hooks/useSetting';
import { CommentProvider } from '@/providers/comment';
import { SettingProvider } from '@/providers/setting';

import style from './index.module.scss';

export const CommentAction = ({ comment, refresh }) => {
  const setting = useSetting();
  const [replyContent, setReplyContent] = useState(null);
  const [replyVisible, setReplyVisible] = useState(false);

  //Modify comment
  const updateComment = useCallback(
    (comment, pass = false) => {
      CommentProvider.updateComment(comment.id, { pass }).then(() => {
        message.success(pass ? 'Comment Passed' : 'Comment Rejected');
        refresh();
      });
    },
    [refresh]
  );

  const reply = useCallback(() => {
    if (!replyContent) {
      return;
    }
    const userInfo = JSON.parse(window.localStorage.getItem('user'));
    const email = (userInfo && userInfo.mail) || (setting && setting.smtpFromUser);
    const notify = () => {
      notification.error({
        message: 'Failed To Reply To Comment',
        description:
          'Please Go To The System Settings To Complete The SMTP Settings, And Go To The Personal Center To Update Your Personal Email.',
      });
    };

    const handle = (email) => {
      const data = {
        name: userInfo.name,
        email,
        content: replyContent,
        parentCommentId: comment.parentCommentId || comment.id,
        hostId: comment.hostId,
        isHostInPage: comment.isHostInPage,
        replyUserName: comment.name,
        replyUserEmail: comment.email,
        url: comment.url,
        createByAdmin: true,
      };

      CommentProvider.addComment(data)
        .then(() => {
          message.success('Reply Successfully');
          setReplyContent('');
          refresh();
        })
        .catch(() => notify());
    };

    if (!email) {
      SettingProvider.getSetting()
        .then((res) => {
          if (res && res.smtpFromUser) {
            handle(res.smtpFromUser);
          } else {
            notify();
          }
          setReplyVisible(false);
        })
        .catch(() => {
          notify();
          setReplyVisible(false);
        });
    } else {
      handle(email);
      setReplyVisible(false);
    }
  }, [
    replyContent,
    comment.email,
    comment.hostId,
    comment.id,
    comment.isHostInPage,
    comment.name,
    comment.parentCommentId,
    comment.url,
    refresh,
    setting,
  ]);

  // Delete Comment
  const deleteComment = useCallback(
    (id) => {
      CommentProvider.deleteComment(id).then(() => {
        message.success('Comment Deleted Successfully');
        refresh();
      });
    },
    [refresh]
  );

  return (
    <div>
      <span className={style.action}>
        <a onClick={() => updateComment(comment, true)}>Pass</a>
        <Divider type="vertical" />
        <a onClick={() => updateComment(comment, false)}>Deny</a>
        <Divider type="vertical" />
        <a onClick={() => setReplyVisible(true)}>Reply</a>
        <Divider type="vertical" />
        <Popconfirm
          title="Are You Sure You Want To Delete This Comment?"
          onConfirm={() => deleteComment(comment.id)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <a>Delete</a>
        </Popconfirm>
      </span>
      <Modal
        title={'Reply To Comment'}
        visible={replyVisible}
        cancelText={'Cancel'}
        okText={'Reply'}
        onOk={reply}
        onCancel={() => setReplyVisible(false)}
        transitionName={''}
        maskTransitionName={''}
      >
        <Input.TextArea
          autoSize={{ minRows: 6, maxRows: 10 }}
          placeholder="Support Markdown"
          value={replyContent}
          autoFocus={true}
          onChange={(e) => {
            const val = e.target.value;
            setReplyContent(val);
          }}
        ></Input.TextArea>
      </Modal>
    </div>
  );
};
