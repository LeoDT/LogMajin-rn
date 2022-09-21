import {Alert, DevSettings} from 'react-native';

import {MMKVInstance, MMKVLoader} from 'react-native-mmkv-storage';
import mmkvFlipper from 'rn-mmkv-storage-flipper';

export const logTypeMMKVStorage = new MMKVLoader()
  .withInstanceID('logType')
  .initialize();

export const logMMKVStorage = new MMKVLoader()
  .withInstanceID('log')
  .initialize();

export const logIndexMMKVStorage = new MMKVLoader()
  .withInstanceID('logIndex')
  .initialize();

export const logInputHistoryMMKVStorage = new MMKVLoader()
  .withInstanceID('logInputHistory')
  .initialize();

export function makeStorageWithMMKV<Value extends object>(mmkv: MMKVInstance) {
  return {
    getItem: (k: string) => {
      console.log(`get ${k}`);
      const i = mmkv.getMap<Value>(k);

      if (i) {
        return i;
      }

      throw Error(`No item with key ${k}`);
    },
    setItem: (k: string, v: Value) => {
      console.log(`set ${k}, ${v}`);
      mmkv.setMap(k, v);
    },
    removeItem: (k: string) => {
      mmkv.removeItem(k);
    },

    delayInit: false,
  };
}

export function clearLogStores() {
  logMMKVStorage.clearStore();
  logIndexMMKVStorage.clearStore();
  logInputHistoryMMKVStorage.clearStore();
}

if (__DEV__) {
  mmkvFlipper(logTypeMMKVStorage);
}

export async function logAllLogType() {
  console.log(
    JSON.stringify(
      (await logTypeMMKVStorage.indexer.maps.getAll()).map(([_, v]) => v),
    ),
  );
}

export function fillTestLogType() {
  logTypeMMKVStorage.clearStore();

  const testData = [
    {
      id: 'LU_xP6rN5R1ClJkGQNQ8I',
      name: '饿了',
      placeholders: [
        {
          content: '饿了',
          name: 'text',
          kind: 'text',
          id: 'tG4sk0eJHDQePfRjP5G-Y',
        },
      ],
      revision: 0,
      createAt: '2022-09-08T00:19:43.128Z',
      updateAt: '2022-09-08T00:19:43.128Z',
      color: 'yellow',
      icon: './Others/game.svg',
    },
    {
      id: 'aWEwmTL8BgWXOtchid6Th',
      name: '喝咖啡',
      placeholders: [
        {
          content: '在',
          name: 'text',
          kind: 'text',
          id: 'g2HcV0v_kIAjQcnYzXTdY',
        },
        {
          options: ['家', '公司', '其他'],
          multiple: false,
          name: '地点',
          kind: 'select',
          id: 'M6VhQWmHN7n6o4UNOiAWu',
        },
        {
          content: '喝了一杯',
          id: 'Y4iLJsQDKyqQ0y_xiMTEG',
          kind: 'text',
          name: 'new text',
        },
        {
          options: ['黑', '拿铁'],
          multiple: false,
          id: '7viw5idnYjw5_0Ez8SgR7',
          kind: 'select',
          name: '咖啡',
        },
      ],
      revision: 0,
      createAt: '2022-09-08T00:20:00.126Z',
      updateAt: '2022-09-08T00:20:00.126Z',
      color: 'green',
      icon: './Map/cup.svg',
    },
    {
      id: '69mthI-x_y6hcBoCnMbHI',
      name: '坐地铁',
      placeholders: [
        {
          content: '从',
          name: 'text',
          kind: 'text',
          id: '5OJfQlOT50xRODiy11_NT',
        },
        {name: '出发地', kind: 'text-input', id: '16ESPV0M54v2kw_ic2oZ3'},
        {
          content: '到',
          id: 'lTguSDB6l_3KlnL_LmaX8',
          kind: 'text',
          name: 'new text',
        },
        {id: 'IrQIVpiDbNtlohAfSVbCc', kind: 'text-input', name: '目的地'},
      ],
      revision: 0,
      createAt: '2022-09-08T00:21:46.609Z',
      updateAt: '2022-09-08T00:21:46.609Z',
      color: 'blue',
      icon: './Map/subway.svg',
    },
    {
      id: 'k0f-8NpIYBxTgELGqcNHD',
      name: '打车',
      placeholders: [
        {
          content: '从',
          name: 'text',
          kind: 'text',
          id: 'xRuO2MNrSHDCDfgYGJlYr',
        },
        {name: '出发地', kind: 'text-input', id: 'ZrQec1pZqCs8zpzd2E845'},
        {
          content: '到',
          id: '7uAnTEOWHtq0nr6Z-nPFj',
          kind: 'text',
          name: 'new text',
        },
        {id: 'k_CLRhQz4rJ3AEZQI9LC5', kind: 'text-input', name: '目的地'},
        {
          content: '花了',
          id: 't6LHUk4yJ6yEYe071i885',
          kind: 'text',
          name: 'new text',
        },
        {id: '0vRL0OqDA8-K6m-OryeFO', kind: 'number', name: '多少钱'},
      ],
      revision: 0,
      createAt: '2022-09-08T00:22:44.193Z',
      updateAt: '2022-09-08T00:22:44.193Z',
      color: 'red',
      icon: './Map/taxi.svg',
    },
    {
      id: 'q6SEH4hOfzidac8y_oIwn',
      name: '变身',
      placeholders: [
        {
          content: '变身',
          name: 'text',
          kind: 'text',
          id: 'QBUXG_HxQLLxnyjBnUqjM',
        },
      ],
      revision: 0,
      createAt: '2022-09-08T00:23:45.340Z',
      updateAt: '2022-09-08T00:23:45.340Z',
      color: 'violet',
      icon: './Design/magic.svg',
    },
  ];

  testData.forEach(d => {
    logTypeMMKVStorage.setMap(d.id, d);
  });

  logTypeMMKVStorage.setArray(
    'all',
    testData.map(d => d.id),
  );
}

DevSettings.addMenuItem('fill', () => fillTestLogType());
DevSettings.addMenuItem('clear', () => {
  clearLogStores();
  logTypeMMKVStorage.clearStore();
});
DevSettings.addMenuItem('reset', () => {
  clearLogStores();
  logTypeMMKVStorage.clearStore();

  fillTestLogType();

  DevSettings.reload();
});

DevSettings.addMenuItem('alert', () => {
  Alert.alert(logTypeMMKVStorage.getMap('q6SEH4hOfzidac8y_oIwn').name);
});

// logAllLogType();

// clearLogStores();
// logTypeMMKVStorage.clearStore();

// fillTestLogType();
