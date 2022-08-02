import {atom} from 'jotai';
import {atomFamily, atomWithStorage} from 'jotai/utils';
import {nanoid} from 'nanoid';
import {Color, randomColorForLogType} from '../colors';

import {logTypeMMKVStorage, makeStorageWithMMKV} from '../utils/storage';

export enum PlaceholderType {
  Text = 'text',
  TextInput = 'text-input',
  Select = 'select',
}

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

export interface LogType {
  id: string;
  name: string;
  placeholders: Array<Placeholder>;
  createAt: Date;
  color: Color;
}

export interface PlaceholderValue {
  name: string;
  value: string;
}

export interface Log {
  id: string;
  type: LogType;
  createAt: number;
  placeholderValues: Array<PlaceholderValue>;
}

export const logTypeStorage = makeStorageWithMMKV<LogType>(logTypeMMKVStorage);

export const logTypesAtom = atom<LogType[]>([]);
logTypesAtom.onMount = set => {
  console.log('onmount');

  (async () => {
    const types: LogType[] = [];
    const items = (await logTypeMMKVStorage.indexer.maps.getAll()) as Array<
      [string, LogType]
    >;

    console.log(`keys ${items}`);

    items?.map(([, v]) => {
      logTypeFamily(v);
      types.push(v);
    });

    set(types);
  })();
};

export const commitLogTypeAtom = atom(null, (get, set, logType: LogType) => {
  const logTypes = get(logTypesAtom);
  const notCommitted = logTypes.findIndex(t => t.id === logType.id) === -1;

  set(logTypeFamily(logType), logType);

  if (notCommitted) {
    set(logTypesAtom, [logType, ...logTypes]);
  }
});

export const logTypeFamily = atomFamily(
  (params: Partial<LogType> & {id: string}) => {
    return atomWithStorage(
      params.id,
      Object.assign(
        {
          name: 'New Log Type',
          placeholders: [
            {name: 'text', kind: PlaceholderType.Text, id: nanoid()},
            {name: 'textInput', kind: PlaceholderType.TextInput, id: nanoid()},
            {
              name: 'select',
              kind: PlaceholderType.Select,
              options: ['Option 1', 'Option 2'],
              id: nanoid(),
            },
          ],
          createAt: new Date(),
          color: randomColorForLogType(),
        },
        params,
      ),
      logTypeStorage,
    );
  },
  (a, b) => a.id === b.id,
);

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
