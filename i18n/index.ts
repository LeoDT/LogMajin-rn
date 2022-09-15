import {useMemo, useState} from 'react';

import i18next, {LanguageDetectorModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {Locale} from 'react-native-localize';

const resources = {
  en: {
    translation: {
      done: 'Done',
      cancel: 'Cancel',
      update: 'Update',

      createTab: 'Create',
      logTab: 'Logs',

      createLogType: 'Create Type',

      placeholderType: {
        text: 'Text',
        select: 'Select',
        'text-input': 'Text Input',
        number: 'Number',
      },

      filter: {
        ago: 'ago',
        ahead: 'ahead',
        contain: 'Contain',
        without: 'Without',
      },

      editLogTypeColorTab: 'Color',
      editLogTypeIconTab: 'Icon',
    },
  },
  zh: {
    translation: {
      done: '完成',
      cancel: '取消',
      update: '更新',

      createTab: '记一条',
      logTab: '历史',

      createLogType: '新类型',

      placeholderType: {
        text: '文本',
        select: '单选',
        'text-input': '输入文本',
        number: '输入数字',
      },

      filter: {
        ago: '之前',
        ahead: '之后',
        contain: '包含',
        without: '不包含',
      },

      editLogTypeColorTab: '颜色',
      editLogTypeIconTab: '图形',
    },
  },
};

let currentLocale = RNLocalize.getLocales()[0];

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => currentLocale.languageCode,
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    debug: __DEV__,
    resources,
  });

export function useLocale(): [Locale, (l: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(currentLocale);

  return [
    locale,
    (l: Locale) => {
      currentLocale = l;
      setLocale(l);
      i18next.changeLanguage(l.languageCode);
    },
  ];
}

export function useDateFormat() {
  const [locale] = useLocale();
  const dateFormat = useMemo(
    () =>
      Intl.DateTimeFormat(locale.languageTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    [locale],
  );

  return dateFormat;
}

export function useDateTimeFormat() {
  const [locale] = useLocale();
  const dateTimeFormat = useMemo(
    () =>
      Intl.DateTimeFormat(locale.languageTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: !RNLocalize.uses24HourClock(),
      }),
    [locale],
  );

  return dateTimeFormat;
}
