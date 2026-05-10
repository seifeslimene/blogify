import { Dropdown } from 'antd';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import React, { useContext, useEffect } from 'react';

import { GlobalContext } from '@/context/global';

export function Locales() {
  const t = useTranslations();
  const { locale: defaultLocale } = useRouter();
  const { i18n, locales = [], changeLocale } = useContext(GlobalContext);

  const menuItems = locales.map((locale) => ({
    key: locale,
    label: (
      <div onClick={() => changeLocale(locale)}>
        {t(locale)}
      </div>
    ),
  }));

  useEffect(() => {
    if (typeof window === 'undefined' || defaultLocale) return;
    const local = window.localStorage.getItem('locale');
    if (local && i18n[local]) {
      changeLocale(local);
    }
  }, [i18n, defaultLocale, changeLocale]);

  return (
    <Dropdown menu={{ items: menuItems }}>
      <div style={{ display: 'flex', alignItems: 'center', width: 24, height: 24, cursor: 'pointer' }}>
        <svg
          viewBox="0 0 24 24"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="languageIconTitle"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
          color="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            {' '}
            <title id="languageIconTitle">Language</title> <circle cx="12" cy="12" r="10"></circle>{' '}
            <path
              strokeLinecap="round"
              d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"
            ></path>{' '}
            <path strokeLinecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>{' '}
          </g>
        </svg>
      </div>
    </Dropdown>
  );
}
