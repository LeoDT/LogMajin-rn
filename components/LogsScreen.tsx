import {sample} from 'lodash-es';
import {useCallback, useEffect, useState} from 'react';
import {View, Text, SectionList, StyleSheet} from 'react-native';

import {useAtomValue, useSetAtom} from 'jotai';
import {useAtomCallback} from 'jotai/utils';

import {
  commitLogAtom,
  loadLogsAtom,
  filteredLogSectionsAtom,
  makeDefaultLog,
} from '../atoms/log';
import {logTypesAtom, PlaceholderType} from '../atoms/logType';
import {colors, colorValueForLogType} from '../colors';
import {LogsFilter} from './LogsFilter';

const randomWords = [
  '啊四大皆空哈桑的几率恢复国会',
  ',形成v这尼玛不v自行车那么不v',
  '去我i入耳呕吐',
  '人同意让他',
  '不v承诺不',
  '乐谱哦迫切',
  '搓v不',
  '前往恩',
  '挺好变成',
];

export function LogsScreen(): JSX.Element {
  const loadLogs = useSetAtom(loadLogsAtom);
  const sections = useAtomValue(filteredLogSectionsAtom);
  const [refreshing, setRefreshing] = useState(false);
  const commit = useSetAtom(commitLogAtom);
  const generateRandom = useAtomCallback(
    useCallback(
      (get, _set, count: number) => {
        const logTypes = get(logTypesAtom);

        function generate() {
          const logType = sample(logTypes);

          if (logType) {
            const l = makeDefaultLog(logType);

            l.placeholderValues.forEach(pv => {
              const p = logType.placeholders.find(({id}) => id === pv.id);

              if (p) {
                switch (p.kind) {
                  case PlaceholderType.Select:
                    pv.value = sample(p.options) ?? '';
                    break;

                  case PlaceholderType.TextInput:
                    pv.value = sample(randomWords) ?? '';
                    break;
                }
              }
            });

            l.content = l.placeholderValues.map(p => p.value).join(' ');

            return l;
          }
        }

        for (var i = 0; i < count; i++) {
          const l = generate();

          l && commit(l);
        }
      },
      [commit],
    ),
  );
  const refresh = useCallback(async () => {
    setRefreshing(true);

    await loadLogs();

    setRefreshing(false);
  }, [loadLogs]);

  useEffect(() => {
    refresh();
    /* generateRandom(10); */
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <LogsFilter />
      </View>
      <SectionList
        style={styles.list}
        onRefresh={refresh}
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        refreshing={refreshing}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.content}</Text>

            <View style={styles.meta}>
              <Text
                style={[
                  styles.type,
                  {color: colorValueForLogType(item.logType.color)},
                ]}>
                {item.logType.name}
              </Text>
              <Text style={styles.date}>{item.createAt.toLocaleString()}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    height: 40,
  },
  list: {
    flex: 1,
  },
  header: {
    fontSize: 12,
    backgroundColor: colors.gray['50'],
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray['200'],
  },
  text: {
    fontSize: 16,
    color: colors.black,
  },
  meta: {
    flexDirection: 'row',
    marginTop: 5,
  },
  type: {
    fontSize: 12,
  },
  date: {
    marginLeft: 'auto',
    fontSize: 12,
  },
});
