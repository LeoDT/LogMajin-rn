import {useMemo} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import CheckSvg from '../assets/check.svg';
import {colors} from '../colors';
import {LogTypeThemedIcon} from './LogTypeThemedIcon';

interface Props {
  options: string[];
  value: string;
  onChange: (v: string) => void;

  multiple?: boolean;
}

export function ListSelect({options, value, onChange}: Props): JSX.Element {
  const data = useMemo(() => options.map(o => ({id: o, text: o})), [options]);

  return (
    <BottomSheetFlatList
      style={styles.list}
      data={data}
      renderItem={({item}) => {
        return (
          <TouchableHighlight
            onPress={() => onChange(item.id)}
            activeOpacity={0.6}
            underlayColor={colors.gray['100']}>
            <View style={styles.item}>
              <View style={styles.icon}>
                {item.id === value ? (
                  <LogTypeThemedIcon
                    IconComponent={CheckSvg}
                    width={22}
                    height={22}
                  />
                ) : null}
              </View>

              <Text>{item.text}</Text>
            </View>
          </TouchableHighlight>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray['400'],
  },
  icon: {
    width: 22,
    marginRight: 10,
  },
});
