import {MMKVInstance, MMKVLoader} from 'react-native-mmkv-storage';

export const logTypeMMKVStorage = new MMKVLoader()
  .withInstanceID('logType')
  .initialize();
// const logMMKVStorage = new MMKVLoader().withInstanceID('log').initialize();

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

    delayInit: true,
  };
}
