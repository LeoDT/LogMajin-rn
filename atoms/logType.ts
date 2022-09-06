import {without} from 'lodash-es';

import {atom, Getter, Setter} from 'jotai';
import {atomFamily} from 'jotai/utils';
import {nanoid} from 'nanoid';

import {Color, randomColorForLogType} from '../colors';
import {logTypeMMKVStorage, makeStorageWithMMKV} from '../utils/storage';

export enum PlaceholderType {
  Text = 'text',
  TextInput = 'text-input',
  Select = 'select',
}

export const needInputPlaceholderTypes = [
  PlaceholderType.TextInput,
  PlaceholderType.Select,
];

export const needRecordHistoryPlaceholderTypes = [PlaceholderType.TextInput];

export interface BasePlaceholder {
  kind: PlaceholderType;
  id: string;
  name: string;
}

export interface TextPlaceholder extends BasePlaceholder {
  kind: PlaceholderType.Text;
  content: string;
}

export interface TextInputPlaceholder extends BasePlaceholder {
  kind: PlaceholderType.TextInput;
  placeholder?: string;
}

export interface SelectPlaceholder extends BasePlaceholder {
  kind: PlaceholderType.Select;
  options: string[];
  multiple: boolean;
}

export type Placeholder =
  | TextPlaceholder
  | TextInputPlaceholder
  | SelectPlaceholder;

export type NeedInputPlaceholder = TextInputPlaceholder | SelectPlaceholder;

export interface LogType {
  id: string;
  name: string;
  placeholders: Array<Placeholder>;
  createAt: Date;
  updateAt: Date;
  color: Color;

  revision: number;
  archiveAt?: Date;
}

export const logTypeStorage = makeStorageWithMMKV<LogType>(logTypeMMKVStorage);

export const logTypesAtom = atom<LogType[]>([]);

export const loadLogTypesAtom = atom(null, (get, set) => {
  console.log('load logTypes');

  const itemIds = logTypeMMKVStorage.getArray('all') as string[];
  const items = logTypeMMKVStorage
    .getMultipleItems<LogType>(itemIds, 'map')
    .map(([_, v]) => v);

  set(
    logTypesAtom,
    items
      ?.filter((v): v is LogType => Boolean(v))
      .map(v => {
        return get(logTypeFamily(v));
      }),
  );
});

export function makeDefaultLogType(id: string): LogType {
  const timestamp = new Date();

  return {
    id,
    name: 'New Log Type',
    placeholders: [
      {name: 'text', kind: PlaceholderType.Text, id: nanoid(), content: ''},
      {name: 'textInput', kind: PlaceholderType.TextInput, id: nanoid()},
      {
        name: 'select',
        kind: PlaceholderType.Select,
        options: ['Option 1', 'Option 2'],
        multiple: false,
        id: nanoid(),
      },
    ],
    revision: 0,
    createAt: timestamp,
    updateAt: timestamp,
    color: randomColorForLogType(),
  };
}

/*
   logType mmkv instance:
   xxxyyyzzz for latest log type
   xxxyyyzzz:1 for log type revision 1 with a log
   all array of latest log type ids
 */

interface LogTypeFamilyParams extends Partial<LogType> {
  id: string;

  persistImmediate?: boolean;
}

interface LogTypeUpdateParams extends Partial<LogType> {
  shouldUpdateTimestamp?: boolean;
}

// return an atom that auto persist
export const logTypeFamily = atomFamily(
  ({persistImmediate = true, ...params}: LogTypeFamilyParams) => {
    const defaultValue = {...makeDefaultLogType(params.id), ...params};
    const persist = (id: string, lt: LogType) => {
      logTypeMMKVStorage.setMap(id, lt);

      const index = logTypeMMKVStorage.getArray('all') ?? [];
      if (!index.includes(id)) {
        logTypeMMKVStorage.setArray('all', [id, ...index]);
      }
    };

    const anAtom = atom<LogType, LogTypeUpdateParams>(
      defaultValue,
      (get, set, {shouldUpdateTimestamp, ...update}: LogTypeUpdateParams) => {
        const logType = get(anAtom);
        const newLogType: LogType = {
          ...logType,
          ...update,
        };

        if (shouldUpdateTimestamp) {
          newLogType.updateAt = new Date();
        }

        persist(logType.id, newLogType);
        set(anAtom, newLogType);
      },
    );

    if (persistImmediate) {
      persist(defaultValue.id, defaultValue);
    }

    return anAtom;
  },
  (a, b) => a.id === b.id,
);

export function isLogTypeRevision(logType: LogType): boolean {
  return logType.id.includes(':');
}

export function assertNotRevision(logType: LogType) {
  if (__DEV__ && isLogTypeRevision(logType)) {
    throw Error(`${logType.id} is already a revision`);
  }
}

export function logTypeIdWithRevision(logType: LogType, revision: number) {
  assertNotRevision(logType);

  return `${logType.id}:${revision}`;
}

export function recordLogTypeRevisionCallback(
  _get: Getter,
  set: Setter,
  logType: LogType,
): LogType {
  assertNotRevision(logType);

  const anAtom = logTypeFamily(logType);
  const increasedRevision = logType.revision + 1;
  const revision = {
    ...logType,
    id: logTypeIdWithRevision(logType, increasedRevision),
    revision: increasedRevision,
  };

  set(anAtom, {revision: increasedRevision, shouldUpdateTimestamp: false});

  const revisionIndexKey = `${logType.id}_revisions`;
  const revisionIndex = logTypeMMKVStorage.getArray(revisionIndexKey) ?? [];
  logTypeMMKVStorage.setArray(revisionIndexKey, [
    revision.id,
    ...revisionIndex,
  ]);

  return revision;
}

export function getLatestLogTypeRevisionCallback(
  get: Getter,
  _set: Setter,
  logType: LogType,
): LogType {
  return get(
    logTypeFamily({id: logTypeIdWithRevision(logType, logType.revision)}),
  );
}

export function getPlaceholderDefaults(t: PlaceholderType) {
  switch (t) {
    case PlaceholderType.Select:
      return {options: ['New Option'], multiple: false};

    case PlaceholderType.Text:
      return {content: ''};

    case PlaceholderType.TextInput:
      return {};

    default:
      return {};
  }
}

export function isLogTypeNeedInput(logType: LogType): boolean {
  return logType.placeholders.some(p =>
    needInputPlaceholderTypes.includes(p.kind),
  );
}

export function getLogTypeHash(lt: LogType): string {
  return `${lt.id}:${lt.updateAt.valueOf()}:${lt.placeholders
    .map(p => p.id)
    .join(':')}`;
}

interface AddPlaceholderParams {
  logTypeId: string;
  name?: string;
  type: PlaceholderType;
}

export const addPlaceholderAtom = atom(
  null,
  (get, set, {logTypeId, type, name}: AddPlaceholderParams) => {
    const a = logTypeFamily({id: logTypeId});
    const logType = get(a);
    const placeholder = {
      id: nanoid(),
      kind: type,
      name: name ?? 'new text',
      ...getPlaceholderDefaults(type),
    } as Placeholder;

    set(a, {
      ...logType,
      placeholders: [...logType.placeholders, placeholder],
    });
  },
);

interface UpdatePlaceholderParams {
  logTypeId: string;
  placeholder: Placeholder;
  update: Partial<Placeholder>;
}

export const updatePlaceholderAtom = atom(
  null,
  (get, set, {logTypeId, placeholder, update}: UpdatePlaceholderParams) => {
    const a = logTypeFamily({id: logTypeId});
    const logType = get(a);

    const placeholderIndex = logType.placeholders.findIndex(
      p => p.id === placeholder.id,
    );

    if (placeholderIndex === -1) {
      throw Error('no such placeholder in logType');
    }

    const newPlaceholder = Object.assign(
      getPlaceholderDefaults(update.kind ?? placeholder.kind),
      placeholder,
      update,
    );

    console.log(logTypeId, logType.id);

    set(a, {
      ...logType,
      placeholders: [
        ...logType.placeholders.slice(0, placeholderIndex),
        newPlaceholder,
        ...logType.placeholders.slice(placeholderIndex + 1),
      ],
    });
  },
);

interface RemovePlaceholderParams {
  logTypeId: string;
  placeholder: Placeholder;
}

export const removePlaceholderAtom = atom(
  null,
  (get, set, {logTypeId, placeholder}: RemovePlaceholderParams) => {
    const a = logTypeFamily({id: logTypeId});
    const logType = get(a);

    const placeholderIndex = logType.placeholders.findIndex(
      p => p.id === placeholder.id,
    );

    if (placeholderIndex === -1) {
      throw Error('no such placeholder in logType');
    }

    set(a, {
      ...logType,
      placeholders: without(logType.placeholders, placeholder),
    });
  },
);
