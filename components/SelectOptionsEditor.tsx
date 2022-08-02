import {useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import {colors} from '../colors';
import HandleSvg from '../assets/handle.svg';

import {useLogTypeTheme} from './LogTypeThemeColorContext';
import {Close} from './Close';

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

  return (
    <View>
      {options?.map((o, i) => (
        <View key={i} style={styles.item}>
          <HandleSvg width={20} height={20} fill={colors.gray['500']} />

          <TextInput
            placeholder={o === '' ? 'New Option' : ''}
            value={o}
            onChangeText={v => handleChange(v, i)}
            style={styles.input}
          />

          {options.length > 1 ? (
            <Close style={styles.close} onPress={() => handleRemove(i)} />
          ) : null}
        </View>
      ))}

      <TouchableOpacity
        onPress={() => {
          handleChange('New Option', options.length);
        }}>
        <Text style={[styles.addNew, {color: themeColor}]}>Add New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 20,
    alignItems: 'center',
  },
  addNew: {
    fontSize: 18,
    marginVertical: 13,
  },
});
