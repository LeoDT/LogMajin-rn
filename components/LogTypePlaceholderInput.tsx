import {useCallback} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

import {PlaceholderValueTypes} from '../atoms/log';
import {NeedInputPlaceholder, PlaceholderType} from '../atoms/logType';
import {colors} from '../colors';
import {ListSelect} from './ListSelect';

interface Props<
  P extends NeedInputPlaceholder,
  V extends PlaceholderValueTypes[P['kind']],
> {
  placeholder: P;

  value: V;
  onChange: (v: V) => void;
}

export function LogTypePlaceholderInput<
  P extends NeedInputPlaceholder,
  V extends PlaceholderValueTypes[P['kind']],
>({placeholder, value, onChange}: Props<P, V>): JSX.Element {
  const renderInput = useCallback(() => {
    switch (placeholder.kind) {
      case PlaceholderType.TextInput:
        return (
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              value={value.value}
              onChangeText={v =>
                onChange({
                  id: placeholder.id,
                  value: v,
                } as V)
              }
            />
          </View>
        );

      case PlaceholderType.Select:
        return (
          <ListSelect
            options={placeholder.options}
            value={value.value}
            onChange={v =>
              onChange({
                id: placeholder.id,
                value: v,
              } as V)
            }
          />
        );
    }
  }, [placeholder, value, onChange]);

  return <View style={styles.container}>{renderInput()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputWrapper: {
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: colors.gray['100'],
    color: colors.black,
    height: 32,
    borderRadius: 10,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
});
