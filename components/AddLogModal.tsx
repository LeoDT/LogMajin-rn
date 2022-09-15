import {useState, useMemo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {commitLogAtom, makeLogAtom} from '../atoms/log';
import {
  logTypeFamily,
  NeedInputPlaceholder,
  PlaceholderType,
} from '../atoms/logType';
import {colors, colorValueForLogType} from '../colors';
import {HomeStackParamList} from '../types';
import {LogTextWithPlaceholders} from './LogTextWithPlaceholders';
import {LogTypePlaceholderInputWizard} from './LogTypePlaceholderInputWizard';
import {LogTypeThemeContext} from './LogTypeThemeColorContext';
import {LogTypeThemedLinkButton} from './LogTypeThemedLinkButton';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddLog'>;

export function AddLogModal({navigation, route}: Props): JSX.Element {
  const {t} = useTranslation();
  const logTypeAtom = logTypeFamily({id: route.params.logTypeId});
  const logType = useAtomValue(logTypeAtom);
  const themeColor = colorValueForLogType(logType.color);
  const newLogAtom = useMemo(() => makeLogAtom(logType), [logType]);
  const placeholders = useMemo<NeedInputPlaceholder[]>(
    () =>
      logType.placeholders.filter(
        (p): p is NeedInputPlaceholder => p.kind !== PlaceholderType.Text,
      ),
    [logType],
  );
  const [newLog, setNewLog] = useAtom(newLogAtom);
  const [activePlaceholder, setActivePlaceholder] =
    useState<NeedInputPlaceholder>(placeholders[0]);

  const commitLog = useSetAtom(commitLogAtom);
  const onFinish = useCallback(() => {
    commitLog(newLog);

    navigation.goBack();
  }, [commitLog, navigation, newLog]);

  return (
    <LogTypeThemeContext.Provider value={themeColor}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>{logType.name}</Text>

          <LogTypeThemedLinkButton
            title={t('cancel')}
            style={styles.cancel}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.time}>
          <Text style={styles.timeText}>
            The log time is: {newLog.createAt.toLocaleString()}
          </Text>

          <LogTypeThemedLinkButton
            title={t('update')}
            onPress={() => {
              setNewLog({...newLog, createAt: new Date()});
            }}
          />
        </View>

        <View style={styles.logContent}>
          <LogTextWithPlaceholders
            log={newLog}
            placeholders={logType.placeholders}
            activePlaceholder={activePlaceholder}
            onPlaceholderPress={p => setActivePlaceholder(p)}
          />
        </View>

        {activePlaceholder ? (
          <LogTypePlaceholderInputWizard
            logAtom={newLogAtom}
            placeholders={placeholders}
            activePlaceholder={activePlaceholder}
            onUpdateActivePlaceholder={setActivePlaceholder}
            onFinish={onFinish}
          />
        ) : null}
      </SafeAreaView>
    </LogTypeThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  cancel: {
    position: 'absolute',
    left: 15,
    top: 0,
    height: 50,
    justifyContent: 'center',
  },
  time: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: colors.gray['200'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  timeText: {
    color: colors.gray['700'],
  },
  logContent: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
});
