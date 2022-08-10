import {Fragment} from 'react';
import {StyleSheet, Text} from 'react-native';

import {Log} from '../atoms/log';
import {
  NeedInputPlaceholder,
  Placeholder,
  PlaceholderType,
} from '../atoms/logType';
import {colors} from '../colors';
import {useLogTypeTheme} from './LogTypeThemeColorContext';

interface Props {
  log: Log;
  placeholders: Placeholder[];
  activePlaceholder?: NeedInputPlaceholder;
  onPlaceholderPress: (p: NeedInputPlaceholder) => void;
}

export function LogTextWithPlaceholders({
  log,
  placeholders,
  activePlaceholder,
  onPlaceholderPress,
}: Props): JSX.Element {
  const themeColor = useLogTypeTheme();

  return (
    <Text style={styles.logText}>
      {placeholders.map(p => {
        const value = log.placeholderValues.find(({id}) => id === p.id);
        const name = value?.value ? value.value : p.name;

        switch (p.kind) {
          case PlaceholderType.Text:
            return <Text key={p.id}>{p.content}</Text>;
          default:
            return (
              <Fragment key={p.id}>
                <Text> </Text>
                <Text
                  onPress={() => onPlaceholderPress(p)}
                  key={p.id}
                  style={[
                    styles.placeholderName,
                    {
                      backgroundColor:
                        p === activePlaceholder
                          ? themeColor
                          : colors.gray['600'],
                    },
                  ]}>
                  {' '}
                  {name}{' '}
                </Text>
                <Text> </Text>
              </Fragment>
            );
        }
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  logText: {
    fontSize: 18,
    color: colors.black,
    lineHeight: 27,
  },
  placeholderName: {
    color: colors.white,
  },
});
