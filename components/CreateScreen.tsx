import {useCallback, useMemo} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useAtomValue, useSetAtom} from 'jotai';
import {useAtomCallback} from 'jotai/utils';
import {nanoid} from 'nanoid';
import {useTranslation} from 'react-i18next';

import {commitLogAtom, makeDefaultLog} from '../atoms/log';
import {
  isLogTypeNeedInput,
  logTypeFamily,
  logTypesAtom,
} from '../atoms/logType';
import {colors} from '../colors';
import {LogTypeItem} from './LogTypeItem';

export function CreateScreen(): JSX.Element {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const logTypes = useAtomValue(logTypesAtom);
  const makeLogType = useAtomCallback(
    useCallback(
      (get, set) => {
        const id = nanoid();
        const atom = logTypeFamily({id});

        /* set(logTypesAtom, [get(atom), ...get(logTypesAtom)]); */

        navigation.navigate('EditLogType', {logTypeId: id});
      },
      [navigation],
    ),
  );
  const commitLog = useSetAtom(commitLogAtom);
  const {width} = useWindowDimensions();
  const listSize = useMemo(() => {
    const columns = width >= 225 * 2 ? 3 : 2;

    return {
      columns,
      size: Math.floor((width - 15 * (columns + 1)) / columns),
    };
  }, [width]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        key={listSize.columns}
        style={styles.logTypeList}
        data={logTypes}
        numColumns={listSize.columns}
        horizontal={false}
        renderItem={({item, index}) => (
          <View
            style={[
              styles.logTypeItem,
              {
                width: listSize.size,
                marginRight:
                  index % listSize.columns < listSize.columns - 1 ? 15 : 0,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (isLogTypeNeedInput(item)) {
                  navigation.navigate('AddLog', {
                    logTypeId: item.id,
                  });
                } else {
                  commitLog(makeDefaultLog(item));
                }
              }}>
              <LogTypeItem logTypeId={item.id} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.create}>
        <TouchableHighlight
          style={styles.createButton}
          onPress={() => {
            makeLogType();
          }}>
          <Text style={styles.createText}>{t('createLogType')}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  logTypeList: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  logTypeItem: {
    marginBottom: 15,
    height: 145,
  },
  create: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.black,
    borderRadius: 30,
  },
  createText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
