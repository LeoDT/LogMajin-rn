import {useSetAtom} from 'jotai';
import {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Keyboard,
} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import {addPlaceholderAtom, LogType, PlaceholderType} from '../atoms/logs';
import {showPlaceholderType} from '../utils/logType';
import {colors} from '../colors';

interface Props {
  logType: LogType;
}

const placeholders = Object.values(PlaceholderType).map(v => ({
  id: v,
  text: showPlaceholderType(v),
  value: v,
}));

export function AddLogTypePlaceholderSheet({logType}: Props, ref): JSX.Element {
  const addLogTypePlaceholder = useSetAtom(addPlaceholderAtom);

  return (
    <BottomSheet
      snapPoints={[120, '30%']}
      style={styles.sheet}
      backgroundStyle={styles.sheetBackground}
      ref={ref}>
      <BottomSheetFlatList
        style={styles.container}
        data={placeholders}
        renderItem={({item}) => (
          <TouchableHighlight
            style={styles.item}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() =>
              addLogTypePlaceholder({logTypeId: logType.id, type: item.value})
            }>
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableHighlight>
        )}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'rgba(255,255,255,0)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  sheetBackground: {
    backgroundColor: colors.gray['50'],
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: colors.white,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemText: {
    color: colors.black,
    fontSize: 18,
  },
});
