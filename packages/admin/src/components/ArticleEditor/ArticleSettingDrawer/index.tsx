import { Button, Drawer, Input, Select, Switch } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';

import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { CategoryProvider } from '@/providers/category';
import { TagProvider } from '@/providers/tag';

import style from './index.module.scss';

interface IProps {
  visible: boolean;
  article?: Partial<IArticle>;
  onClose: () => void;
  onChange?: (arg) => void;
}

const FormItem = ({ label, content }) => {
  return (
    <div className={style.formItem}>
      <span>{label}</span>
      <div>{content}</div>
    </div>
  );
};

const initialArticleAttrs = {
  summary: null, // Summary
  password: null, // Password
  isCommentable: true, // Comments
  isRecommended: true, // Recommend To Homepage
  category: null, // Category
  tags: [], // Tags
  cover: null, // Cover
};
function reducer(state: typeof initialArticleAttrs = initialArticleAttrs, action) {
  const payload = action.payload;
  switch (action.type) {
    case 'summary':
      return { ...state, summary: payload };
    case 'password':
      return { ...state, password: payload };
    case 'isCommentable':
      return { ...state, isCommentable: payload };
    case 'isRecommended':
      return { ...state, isRecommended: payload };
    case 'category':
      return { ...state, category: payload };
    case 'tags':
      return { ...state, tags: payload };
    case 'cover':
      return { ...state, cover: payload };
    default:
      return state;
  }
}
export const ArticleSettingDrawer: React.FC<IProps> = ({ article, visible, onClose, onChange }) => {
  const [fileVisible, setFileVisible] = useState(false);
  const [attrs, dispatch] = useReducer(reducer, article as typeof initialArticleAttrs);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [tags, setTags] = useState<Array<ITag>>([]);

  useEffect(() => {
    CategoryProvider.getCategory().then((res) => setCategories(res));
    TagProvider.getTags().then((tags) => setTags(tags));
  }, []);

  const ok = () => {
    onChange({
      ...attrs,
      tags: (attrs.tags || []).join(','),
    });
  };

  return (
    <Drawer
      width={480}
      placement="right"
      title={'Article Settings'}
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      <FormItem
        label="Article Abstract"
        content={
          <Input.TextArea
            className={style.formItem}
            placeholder="Please Enter Article Abstract"
            autoSize={{ minRows: 6, maxRows: 8 }}
            value={attrs.summary}
            onChange={(e) => {
              dispatch({ type: 'summary', payload: e.target.value });
            }}
          />
        }
      />
      <FormItem
        label="Access Password"
        content={
          <Input.Password
            placeholder="Password Eequired To View After Entering"
            value={attrs.password}
            onChange={(e) => {
              dispatch({ type: 'password', payload: e.target.value });
            }}
          />
        }
      />
      <FormItem
        label="Enable Comments"
        content={
          <Switch
            checked={attrs.isCommentable}
            onChange={(val) => {
              dispatch({ type: 'isCommentable', payload: val });
            }}
          />
        }
      />
      <FormItem
        label="Home Page Recommendation"
        content={
          <Switch
            checked={attrs.isRecommended}
            onChange={(val) => {
              dispatch({ type: 'isRecommended', payload: val });
            }}
          />
        }
      />
      <FormItem
        label="Select Category"
        content={
          <Select
            value={(attrs.category && attrs.category.id) || attrs.category}
            onChange={(id) => {
              dispatch({ type: 'category', payload: id });
            }}
            style={{ width: '100%' }}
          >
            {categories.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.label}
              </Select.Option>
            ))}
          </Select>
        }
      />
      <FormItem
        label="Select Label"
        content={
          <Select
            style={{ width: '100%' }}
            mode="tags"
            value={(attrs.tags || []).map((t) => t.id || t)}
            onChange={(tags) => {
              dispatch({ type: 'tags', payload: tags });
            }}
          >
            {tags.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.label}
              </Select.Option>
            ))}
          </Select>
        }
      />
      <FormItem
        label="Article Cover"
        content={
          <div className={style.cover}>
            {attrs.cover ? (
              <div onClick={() => setFileVisible(true)} className={style.preview}>
                <img src={attrs.cover} alt="Preview" />
              </div>
            ) : (
              <div className={`${style.preview} no-preview`} onClick={() => setFileVisible(true)}>
                No Preview Photo
              </div>
            )}
            <Input
              placeholder="Or Enter An External Link"
              value={attrs.cover}
              onChange={(e) => {
                dispatch({ type: 'cover', payload: e.target.value });
              }}
            />
            <Button
              onClick={() => {
                dispatch({ type: 'cover', payload: null });
              }}
            >
              Remove
            </Button>
          </div>
        }
      />
      <FileSelectDrawer
        closeAfterClick={true}
        visible={fileVisible}
        onClose={() => setFileVisible(false)}
        onChange={(url) => {
          dispatch({ type: 'cover', payload: url });
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Button type="primary" onClick={ok}>
          Confirm
        </Button>
      </div>
    </Drawer>
  );
};
