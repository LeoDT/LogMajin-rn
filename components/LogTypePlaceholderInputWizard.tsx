import {last, clamp} from 'lodash-es';
import {useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import {useAtom, WritableAtom} from 'jotai';
import {useTranslation} from 'react-i18next';
import {Shadow} from 'react-native-shadow-2';

import {Log, PlaceholderValue} from '../atoms/log';
import {NeedInputPlaceholder} from '../atoms/logType';
import {colors} from '../colors';
import {showPlaceholderType} from '../utils/logType';
import {LogTypePlaceholderInput} from './LogTypePlaceholderInput';
import {LogTypeThemedLinkButton} from './LogTypeThemedLinkButton';

interface Props {
  logAtom: WritableAtom<Log, Partial<Log>>;
  placeholders: NeedInputPlaceholder[];

  activePlaceholder: NeedInputPlaceholder;
  onUpdateActivePlaceholder: (p: NeedInputPlaceholder) => void;

  onFinish: () => void;
}

export function LogTypePlaceholderInputWizard({
  placeholders,
  logAtom,
  activePlaceholder,
  onUpdateActivePlaceholder,
  onFinish,
}: Props): JSX.Element {
  const {t} = useTranslation();
  const [log, setLog] = useAtom(logAtom);

  const activePlaceholderValue = useMemo(
    () => log.placeholderValues.find(({id}) => id === activePlaceholder?.id),
    [log, activePlaceholder],
  );
  const updatePlaceholderValue = useCallback(
    (value: PlaceholderValue) => {
      const values = log.placeholderValues;
      const index = values.findIndex(({id}) => id === value.id);

      if (index > -1) {
        setLog({
          ...log,
          placeholderValues: [
            ...values.slice(0, index),
            value,
            ...values.slice(index + 1),
          ],
        });
      }
    },
    [log, setLog],
  );

  const isFirst = useMemo(
    () => placeholders[0] === activePlaceholder,
    [activePlaceholder, placeholders],
  );
  const isLast = useMemo(
    () => last(placeholders) === activePlaceholder,
    [activePlaceholder, placeholders],
  );
  const activatePlaceholder = useCallback(
    (offset: number) => {
      const index = placeholders.findIndex(p => p === activePlaceholder);
      const target = clamp(index + offset, 0, placeholders.length);

      onUpdateActivePlaceholder(placeholders[target]);
    },
    [activePlaceholder, placeholders, onUpdateActivePlaceholder],
  );

  return (
    <BottomSheet
      snapPoints={[240]}
      style={styles.container}
      keyboardBlurBehavior="restore"
      enableOverDrag={false}>
      <View style={styles.tools}>
        <Text style={styles.name}>{activePlaceholder.name}</Text>
        <Text style={styles.type}>
          {t(`placeholderType.${activePlaceholder.kind}`)}
        </Text>

        <View style={styles.navs}>
          <LogTypeThemedLinkButton
            title={t('prev')}
            style={styles.nav}
            onPress={() => {
              if (!isFirst) {
                activatePlaceholder(-1);
              }
            }}
            isDisabled={isFirst}
          />
          <LogTypeThemedLinkButton
            title={isLast ? t('done') : t('next')}
            style={styles.nav}
            onPress={() => {
              if (isLast) {
                onFinish();
              } else {
                activatePlaceholder(1);
              }
            }}
          />
        </View>
      </View>

      {activePlaceholderValue ? (
        <View style={styles.input}>
          <LogTypePlaceholderInput
            placeholder={activePlaceholder}
            value={activePlaceholderValue}
            onChange={updatePlaceholderValue}
          />
        </View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 24,
    color: colors.black,
  },
  type: {
    fontSize: 14,
    color: colors.gray['600'],
    marginLeft: 10,
  },
  navs: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  nav: {
    fontSize: 14,
    marginLeft: 10,
    textAlignVertical: 'bottom',
  },
  navDisabled: {
    color: colors.gray['600'],
  },
  input: {
    flex: 1,
    marginTop: 10,
  },
});
