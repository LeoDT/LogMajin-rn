import {useMemo, useState} from 'react';

import i18next, {LanguageDetectorModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {Locale} from 'react-native-localize';

const resources = {
  en: {
    translation: {
      done: 'Done',
      confirm: 'Confirm',
      cancel: 'Cancel',
      update: 'Update',
      edit: 'Edit',
      archive: 'Archive',
      delete: 'Delete',

      next: 'Next',
      prev: 'Prev',

      createTab: 'Create',
      logTab: 'Logs',

      logType: {
        defaultName: 'New Log Type',
      },

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
        selectDate: 'Select Date',
        clearDate: 'Clear',
      },

      placeholder: {
        name: 'Name',
        textPlaceholder: 'Some Text',
        option: 'Option',
        selectDefaultOption: 'Option',
        addSelectOption: 'Add Option',
      },

      editLogTypeColorTab: 'Color',
      editLogTypeIconTab: 'Icon',

      textInputHistoryLabel: 'History',
    },
  },
  zh: {
    translation: {
      done: '完成',
      confirm: '确认',
      cancel: '取消',
      update: '更新',
      edit: '编辑',
      archive: '归档',
      delete: '删除',

      next: '下一个',
      prev: '上一个',

      createTab: '记一条',
      logTab: '历史',

      logType: {
        defaultName: '新类型',
      },

      createLogType: '新增类型',

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
        selectDate: '选择日期',
        clearDate: '清除',
      },

      placeholder: {
        name: '名称',
        defaultNameForText: '文本',
        defaultNameForTextInput: '输入文本',
        defaultNameForSelect: '单选',
        defaultNameForNumber: '输入数字',
        textPlaceholder: '固定文本',
        option: '选项',
        selectDefaultOption: '选项',
        addSelectOption: '新增选项',
      },

      editLogTypeColorTab: '颜色',
      editLogTypeIconTab: '图形',

      textInputHistoryLabel: '历史',
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

export {i18next};

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
