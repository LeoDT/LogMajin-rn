import {useCallback} from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {loadLogInputHistory, PlaceholderValueTypes} from '../atoms/log';
import {NeedInputPlaceholder, PlaceholderType} from '../atoms/logType';
import {colors} from '../colors';
import {ListSelect} from './ListSelect';
import {LogTypeThemedLinkButton} from './LogTypeThemedLinkButton';

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
        const history = loadLogInputHistory(placeholder);

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
            {history.length > 0 ? (
              <View style={styles.textInputHistory}>
                <Text style={styles.textInputHistoryTitle}>History</Text>
                <BottomSheetScrollView
                  style={styles.textInputHistoryListWrapper}
                  horizontal>
                  {history.map((t, i) => (
                    <LogTypeThemedLinkButton
                      key={i}
                      style={styles.textInputHistoryItem}
                      title={t}
                      onPress={() =>
                        onChange({
                          id: placeholder.id,
                          value: t,
                        } as V)
                      }
                    />
                  ))}
                </BottomSheetScrollView>
              </View>
            ) : null}
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
  textInputHistory: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 5,
  },
  textInputHistoryTitle: {
    marginRight: 15,
  },
  textInputHistoryListWrapper: {
    flex: 1,
  },
  textInputHistoryList: {
    flex: 1,
  },
  textInputHistoryItem: {
    marginRight: 15,
  },
});
