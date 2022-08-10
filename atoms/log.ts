import {omit, keyBy, groupBy, orderBy} from 'lodash-es';

import {atom} from 'jotai';
import {nanoid} from 'nanoid';

import {makeStorageWithMMKV, logMMKVStorage} from '../utils/storage';
import {LogType, logTypesAtom, PlaceholderType} from './logType';

export interface PlaceholderValue<T extends string = string> {
  id: string;
  value: T;
}

export interface PlaceholderValueTypes {
  [PlaceholderType.Text]: undefined;
  [PlaceholderType.TextInput]: PlaceholderValue<string>;
  [PlaceholderType.Select]: PlaceholderValue<string>;
}

export interface Log {
  id: string;
  logType: LogType;
  createAt: Date;
  placeholderValues: Array<PlaceholderValue>;
  content: string;
}

export interface SerializedLog {
  id: string;
  logTypeId: string;
  createAt: Date;
  placeholderValues: Array<PlaceholderValue>;
  content: string;
}

export const logStorage = makeStorageWithMMKV<SerializedLog>(logMMKVStorage);

export function makeDefaultLog(logType: LogType): Log {
  return {
    logType,
    id: nanoid(),
    placeholderValues: logType.placeholders.map(p => ({
      id: p.id,
      value: p.kind === PlaceholderType.Text ? p.content : '',
    })),
    createAt: new Date(),
    content: '',
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

export const commitLogAtom = atom(null, (get, set, log: Log) => {
  logStorage.setItem(log.id, {
    ...omit(log, ['logType']),
    logTypeId: log.logType.id,
  });

  set(logsAtom, [log, ...get(logsAtom)]);
});

export const logsAtom = atom<Log[]>([]);

export const loadLogsAtom = atom(null, async (get, set) => {
  const logs = (await logMMKVStorage.indexer.maps.getAll()) as Array<
    [string, SerializedLog]
  >;
  const logTypes = get(logTypesAtom);
  const logTypeIndex = keyBy(logTypes, 'id');

  set(
    logsAtom,
    orderBy(
      logs.map(([_, log]) => ({
        ...omit(log, ['logTypeId']),
        createAt: new Date(log.createAt),
        logType: logTypeIndex[log.logTypeId],
      })),
      ['createAt'],
      ['desc'],
    ),
  );
});

export const logSectionsAtom = atom(get => {
  const logs = get(logsAtom);
  const groups = groupBy(logs, l => l.createAt.toDateString());
  const sections: Array<{title: string; data: Log[]}> = [];

  Object.entries(groups).forEach(([k, v]) => {
    sections.push({title: k, data: v});
  });

  return sections;
});
