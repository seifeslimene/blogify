interface IUser {
  name: string;
  avatar: string;
  email: string;
  token: string;
  role: 'admin' | 'visitor';
  type: string;
}

interface IFile {
  id: string;
  originalname: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  createAt: string;
}

interface IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags?: Itag[] | string[] | string;
  cover?: string;
  toc: string;
  views: number;
  category: any;
  status: string;
  password?: string; // access password
  needPassword: boolean;
  isRecommended?: boolean;
  isCommentable?: boolean; // Is it possible to comment?
  likes: number;
  createAt: string;
  updateAt: string;
  publishAt: string;
}

interface ITag {
  id: string;
  label: string;
  value: string;
}

interface ICategory {
  id: string;
  label: string;
  value: string;
}

interface IKnowledge {
  id: string;
  parentId: string;
  order: number;
  title: string;
  cover?: string;
  summary: string;
  content: string;
  html: string;
  toc: string;
  views: number;
  status: 'draft' | 'publish';
  isCommentable?: boolean;
  createAt: string;
  updateAt: string;
  publishAt: string;
  children?: Array<IKnowledge>;
}

interface IPage {
  id: string;
  name: string;
  path: string;
  order: number;
  cover?: string;
  content: string;
  toc: string;
  status: string;
  views: number;
  createAt: string;
  publishAt: string;
}

interface IComment {
  id: string;
  name: string;
  email: string;
  content: string;
  html: string;
  pass: boolean;
  createAt: string;
  userAgent: string;
  article?: IArticle;
  parentCommentId: string;
  hostId: string;
  replyUserName?: string;
  replyUserEmail?: string;
  children?: [IComment];
}

interface IView {
  id: string;
  ip: string;
  userAgent: string;
  url: string;
  browser: string;
  engine: string;
  os: string;
  device: string;
  count: number;
  createAt: string;
  updateAt: string;
}

interface IMail {
  id: string;
  from: string;
  to: string;
  subject: number;
  text: string;
  html: string;
  createAt: string;
}

interface ISearch {
  id: string;
  type: string;
  keyword: string;
  count: number;
  createAt: string;
}

interface ISetting {
  i18n?: string; // globalization
  systemUrl?: string; // System address
  systemTitle?: string; // system title
  systemBg?: string; // Global background
  systemLogo?: string; // system Logo
  systemFavicon?: string; // system favicon
  systemFooterInfo?: string; // System footer information
  adminSystemUrl?: string; // Backend system address

  seoKeyword?: string; // SEO keywords
  seoDesc?: string; //  SEO describe

  googleAnalyticsId?: string; // Google Analytics id

  ossRegion?: string; // Ali Cloud region
  ossAccessKeyId?: string; //  Ali Cloud accessKeyId
  ossAccessKeySecret?: string; //  Ali Cloud  accessKeySecret
  ossHttps?: boolean; // Does Alibaba Cloud oss enable https?
  ossBucket?: string; //  Ali Cloud bucket

  oss?: string; // oss Upload configuration

  smtpHost?: string; //   SMTP address
  smtpPort?: number; //  SMTP port
  smtpUser?: string; //  SMTP user
  smtpPass?: string; //  SMTP Authorization code
  smtpFromUser?: string; // SMTP sender
}

interface IPoster {
  id: string;
  name: string;
  pageUrl: string;
  imgUrl: string;
  size: number;
  createAt: string;
}
