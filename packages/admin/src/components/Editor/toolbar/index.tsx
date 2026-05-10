import React from 'react';

import { AddCode } from './AddCode';
import { Emoji } from './Emoji';
import { File } from './File';
import { Iframe } from './Iframe';
import { Image } from './Image';
import { Magimg } from './Magimg';
import { Video } from './Video';

export const toolbar = [
  {
    label: 'Expression',
    content: ({ editor, monaco }) => <Emoji editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'Upload Image',
    content: ({ editor, monaco }) => <Image editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'Upload Video',
    content: ({ editor, monaco }) => <Video editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'Embed Link',
    content: ({ editor, monaco }) => <Iframe editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'File Library',
    content: ({ editor, monaco }) => <File editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'Zoom In Picture',
    content: ({ editor, monaco }) => <Magimg editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: 'Add Code Block',
    content: ({ editor, monaco }) => <AddCode editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
];
