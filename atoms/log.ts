import {omit, groupBy, orderBy, every, isEmpty, uniq} from 'lodash-es';

import {atom} from 'jotai';
import {nanoid} from 'nanoid';

import {
  makeStorageWithMMKV,
  logMMKVStorage,
  logInputHistoryMMKVStorage,
  logIndexMMKVStorage,
} from '../utils/storage';
import {
  LogType,
  PlaceholderType,
  logTypeFamily,
  needRecordHistoryPlaceholderTypes,
  Placeholder,
  getLogTypeHash,
  recordLogTypeRevisionCallback,
  getLatestLogTypeRevisionCallback,
} from './logType';

export interface PlaceholderValue<T = string> {
  id: string;
  value: T;
}

export interface PlaceholderValueTypes {
  [PlaceholderType.Text]: undefined;
  [PlaceholderType.TextInput]: PlaceholderValue<string>;
  [PlaceholderType.Select]: PlaceholderValue<string>;
  [PlaceholderType.Number]: PlaceholderValue<string>;
}

export interface Log {
  id: string;
  logType: LogType;
  createAt: Date;
  placeholderValues: Array<PlaceholderValue>;
  content: string;
  revisionId: string;
}

export interface SerializedLog extends Omit<Log, 'logType' | 'createAt'> {
  logTypeId: string;
  createAt: string;

  // revision is a logType snapshot identified with logTypeHash
  // revision is created when new log is commited
  logTypeHash: string;
}

export const logStorage = makeStorageWithMMKV<SerializedLog>(logMMKVStorage);

export function serializeLog(
  log: Log,
  revision: LogType,
  hash?: string,
): SerializedLog {
  return {
    ...omit(log, ['logType']),
    logTypeId: log.logType.id,
    createAt: log.createAt.toISOString(),
    logTypeHash: hash ?? getLogTypeHash(revision),
    revisionId: revision.id,
  };
}

export function deserializeLog(log: SerializedLog, logType: LogType): Log {
  return {
    ...omit(log, ['logTypeId', 'logTypeHash']),
    createAt: new Date(log.createAt),
    logType,
  };
}

export function makeDefaultLog(logType: LogType): Log {
  const values = logType.placeholders.map(p => ({
    id: p.id,
    value: p.kind === PlaceholderType.Text ? p.content : '',
  }));

  return {
    logType,
    id: nanoid(),
    placeholderValues: values,
    createAt: new Date(),
    content: values.map(p => p.value).join(' '),
    revisionId: '',
  };
}

export function makeLogAtom(logType: LogType) {
  const a = atom(makeDefaultLog(logType), (get, set, update: Partial<Log>) => {
    const newLog = {
      ...get(a),
      ...update,
    };

    newLog.content = newLog.placeholderValues.map(p => p.value).join(' ');

    set(a, newLog);
  });

  return a;
}

export function recordLogInputHistory(log: Log) {
  log.logType.placeholders
    .filter(p => needRecordHistoryPlaceholderTypes.includes(p.kind))
    .forEach(p => {
      const value = log.placeholderValues.find(v => v.id === p.id);

      if (value) {
        const history = logInputHistoryMMKVStorage.getArray(p.id) ?? [];

        history.unshift(value.value);

        logInputHistoryMMKVStorage.setArrayAsync(p.id, uniq(history));
      }
    });
}

export function loadLogInputHistory(placeholder: Placeholder): string[] {
  const history =
    (logInputHistoryMMKVStorage.getArray(placeholder.id) as string[]) ?? [];

  return history;
}

export const commitLogAtom = atom(null, (get, set, log: Log) => {
  const lastLogId = logIndexMMKVStorage.getArray(log.logType.id)?.[0] as string;
  const lastLog = (
    lastLogId ? logMMKVStorage.getMap(lastLogId) : null
  ) as SerializedLog | null;

  let revision = getLatestLogTypeRevisionCallback(get, set, log.logType);
  let hash = getLogTypeHash(revision);

  if (lastLog?.logTypeHash !== hash) {
    console.log('record');
    revision = recordLogTypeRevisionCallback(get, set, log.logType);
    hash = getLogTypeHash(revision);
  }

  logMMKVStorage.setMap(log.id, serializeLog(log, revision, hash));

  const logIndexForLogType = logIndexMMKVStorage.getArray(log.logType.id) ?? [];
  logIndexMMKVStorage.setArray(log.logType.id, [log.id, ...logIndexForLogType]);

  set(logsAtom, [log, ...get(logsAtom)]);

  recordLogInputHistory(log);
});

export const logsAtom = atom<Log[]>([]);

export const loadLogsAtom = atom(null, async (get, set) => {
  console.log('load logs');

  const logs = (await logMMKVStorage.indexer.maps.getAll()) as Array<
    [string, SerializedLog]
  >;

  set(
    logsAtom,
    orderBy(
      logs.map(([_, log]) =>
        deserializeLog(log, get(logTypeFamily({id: log.logTypeId}))),
      ),
      ['createAt'],
      ['desc'],
    ),
  );
});

export interface LogFilter {
  contain?: string;
  logTypes?: LogType[];
  from?: Date;
  to?: Date;
}

export const filterAtom = atom<LogFilter>({});

export function isFilterEmpty(filter: LogFilter) {
  return isEmpty(filter) || Object.values(filter).every(v => !v);
}

export const filteredLogsAtom = atom(get => {
  const logs = get(logsAtom);
  const filter = get(filterAtom);

  if (isFilterEmpty(filter)) {
    return logs;
  }

  return logs.filter(l => {
    const hits = [
      filter.contain
        ? l.content.toLowerCase().search(filter.contain.toLowerCase()) !== -1
        : true,
      filter.logTypes && filter.logTypes.length > 0
        ? filter.logTypes.includes(l.logType)
        : true,
      filter.from ? l.createAt >= filter.from : true,
      filter.to ? l.createAt <= filter.to : true,
    ];

    return every(hits, Boolean);
  });
});

export const filteredLogSectionsAtom = atom(get => {
  const logs = get(filteredLogsAtom);
  const groups = groupBy(logs, l => l.createAt.toDateString());
  const sections: Array<{date: Date; data: Log[]}> = [];

  Object.entries(groups).forEach(([_, v]) => {
    sections.push({data: v, date: v[0].createAt});
  });

  return sections;
});
