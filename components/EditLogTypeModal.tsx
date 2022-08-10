import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAtomValue, useSetAtom} from 'jotai';
import {forwardRef, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  FlatList,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import {logTypeFamily} from '../atoms/logType';
import {colors, colorValueForLogType} from '../colors';
import {HomeStackParamList} from '../types';

import {LogTypeThemeContext} from './LogTypeThemeColorContext';
import {Close} from './Close';
import {LogTypePlaceholderEditor} from './LogTypePlaceholderEditor';
import {AddLogTypePlaceholderSheet} from './AddLogTypePlaceholderSheet';

const AddLogTypePlaceholderSheetForward = forwardRef(
  AddLogTypePlaceholderSheet,
);
const SHEET_PADDING = 120;

type Props = NativeStackScreenProps<HomeStackParamList, 'EditLogType'>;

export function EditLogTypeModal({route, navigation}: Props): JSX.Element {
  const {logTypeId} = route.params;
  const logTypeAtom = logTypeFamily({id: logTypeId});
  const logType = useAtomValue(logTypeAtom);
  const setLogType = useSetAtom(logTypeAtom);
  const themeColor = useMemo(
    () => colorValueForLogType(logType.color),
    [logType],
  );

  const sheetRef = useRef<BottomSheet>(null);
  const [sheetPadding, setSheetPadding] = useState(SHEET_PADDING);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      sheetRef.current?.close();
      setSheetPadding(0);
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      sheetRef.current?.snapToIndex(0);
      setSheetPadding(SHEET_PADDING);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <LogTypeThemeContext.Provider value={themeColor}>
      <SafeAreaView style={[styles.container, {paddingBottom: sheetPadding}]}>
        <View style={styles.header}>
          <Pressable style={[styles.icon, {backgroundColor: themeColor}]} />
          <TextInput
            value={logType.name}
            onChangeText={v => {
              setLogType({...logType, name: v});
            }}
            style={styles.nameEditor}
          />
          <Close
            style={styles.close}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        <FlatList
          style={styles.placeholderList}
          data={logType.placeholders}
          removeClippedSubviews={false}
          renderItem={({item, index}) => (
            <View
              style={[
                styles.placeholderItem,
                index === 0 ? styles.firstPlaceholderItem : null,
              ]}>
              <LogTypePlaceholderEditor logType={logType} placeholder={item} />
            </View>
          )}
        />

        <AddLogTypePlaceholderSheetForward logType={logType} ref={sheetRef} />
      </SafeAreaView>
    </LogTypeThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray['100'],
    paddingBottom: 120,
  },
  header: {
    padding: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12.0,
    elevation: 6,
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: colors.orange['800'],
  },
  close: {
    marginLeft: 'auto',
  },
  nameEditor: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  placeholderList: {
    flex: 1,
  },
  placeholderItem: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  firstPlaceholderItem: {
    marginTop: 20,
  },
});
