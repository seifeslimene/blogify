export const menus = [
  {
    icon: 'dashboard',
    title: 'Workbench',
    path: '/',
  },
  {
    icon: 'form',
    title: 'Article Management',
    children: [
      {
        icon: 'form',
        title: 'All Articles',
        path: '/article',
      },
      {
        title: 'Create New Article',
        path: '/article/editor',
        ignore: true,
      },
      {
        title: 'Edit Article',
        path: '/article/editor/[id]',
        ignore: true,
      },
      {
        icon: 'copy',
        title: 'Classification Management',
        path: '/article/category',
      },
      {
        icon: 'tag',
        title: 'Tag Management',
        path: '/article/tags',
      },
    ],
  },
  {
    icon: 'snippets',
    title: 'Page Management',
    path: '/page',
  },
  {
    title: 'Create New Page',
    path: '/page/editor',
    ignore: true,
  },
  {
    title: 'How To Manage',
    path: '/page/editor/[id]',
    ignore: true,
  },
  {
    title: 'Knowledge Booklet',
    path: '/knowledge',
    icon: 'book',
  },
  {
    icon: 'message',
    title: 'Comment Management',
    path: '/comment',
  },
  {
    icon: 'mail',
    title: 'Email Management',
    path: '/mail',
  },
  {
    icon: 'folder-open',
    title: 'File Management',
    path: '/file',
  },
  {
    icon: 'search',
    title: 'Search History',
    path: '/search',
  },
  {
    icon: 'project',
    title: 'Statistics',
    path: '/view',
  },
  {
    title: 'Personal Center',
    icon: 'user',
    path: '/ownspace',
    ignore: true,
  },
  {
    icon: 'user',
    title: 'User Management',
    path: '/user',
  },
  {
    icon: 'setting',
    title: 'System Settings',
    path: '/setting?type=System Settings',
  },
];

const flattenMenus = menus
  .filter((m) => !m.ignore)
  .reduce((c, menu) => {
    return [...c, menu, ...(menu.children || []).filter((m) => !m.ignore)];
  }, []);

export const findActiveMenu = (pathname) => {
  const idx = flattenMenus.findIndex((menu) => menu.path === pathname);
  if (idx < 0) {
    return [null, []];
  }

  const activeMenu = flattenMenus[idx];
  const breadcrumbs =
    idx > 1
      ? [
          flattenMenus.slice(0, 1)[0],
          ...flattenMenus.slice(1, idx).filter((menu) => {
            return activeMenu.path.includes(menu.path);
          }),
          activeMenu,
        ]
      : [flattenMenus.slice(0, 1)[0]];

  return [activeMenu, breadcrumbs];
};
