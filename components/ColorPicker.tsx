import {useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';

import {Color, colorsForLogType, colorValueForLogType} from '../colors';

interface Props {
  value: Color;
  onChange: (c: Color) => void;
}

export function ColorPicker({value, onChange}: Props): JSX.Element {
  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<Color>) => {
      const color = colorValueForLogType(item);
      const active = value === item;

      return (
        <TouchableOpacity onPress={() => onChange(item)} activeOpacity={0.8}>
          <View
            style={[
              styles.colorItemWrapper,
              active ? {borderColor: color} : null,
            ]}>
            <View style={[styles.colorItem, {backgroundColor: color}]} />
          </View>
        </TouchableOpacity>
      );
    },
    [value, onChange],
  );

  return (
    <FlatList
      data={colorsForLogType}
      renderItem={renderItem}
      numColumns={colorsForLogType.length / 2}
      columnWrapperStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  colorItemWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 11,
    margin: 2,
  },
  colorItem: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
