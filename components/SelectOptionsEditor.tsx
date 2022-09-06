import {useCallback, useMemo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';

import DraggableFlatList, {
  OpacityDecorator,
} from 'react-native-draggable-flatlist';

import HandleSvg from '../assets/handle.svg';
import {colors} from '../colors';
import {Close} from './Close';
import {useLogTypeTheme} from './LogTypeThemeColorContext';

interface Props {
  options: string[];
  onChange: (options: string[]) => void;
}

export function SelectOptionsEditor({options, onChange}: Props): JSX.Element {
  const themeColor = useLogTypeTheme();
  const handleChange = useCallback(
    (v: string, i: number) => {
      onChange([...options.slice(0, i), v, ...options.slice(i + 1)]);
    },
    [options, onChange],
  );
  const handleRemove = useCallback(
    (i: number) => {
      onChange([...options.slice(0, i), ...options.slice(i + 1)]);
    },
    [options, onChange],
  );
  const listData = useMemo(
    () => options.map((o, i) => ({option: o, index: i})),
    [options],
  );

  return (
    <View>
      <DraggableFlatList
        containerStyle={styles.list}
        data={listData}
        keyExtractor={({index}) => `${index}`}
        onDragEnd={({data}) => {
          onChange(data.map(({option}) => option));
        }}
        renderItem={({item, drag}) => (
          <OpacityDecorator activeOpacity={0.6}>
            <View style={styles.item}>
              <Pressable onPressIn={drag}>
                <HandleSvg width={20} height={20} fill={colors.gray['500']} />
              </Pressable>

              <TextInput
                placeholder={item.option === '' ? 'New Option' : ''}
                value={item.option}
                onChangeText={v => handleChange(v, item.index)}
                style={styles.input}
              />

              {options.length > 1 ? (
                <Close
                  style={styles.close}
                  onPress={() => handleRemove(item.index)}
                />
              ) : null}
            </View>
          </OpacityDecorator>
        )}
      />

      <TouchableOpacity
        style={styles.addNew}
        onPress={() => {
          handleChange('New Option', options.length);
        }}>
        <Text style={[styles.addNewText, {color: themeColor}]}>Add New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray['400'],
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    marginLeft: 5,
  },
  close: {
    flexGrow: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
  },
  addNew: {
    alignSelf: 'flex-start',
  },
  addNewText: {
    fontSize: 18,
    marginVertical: 13,
  },
});
