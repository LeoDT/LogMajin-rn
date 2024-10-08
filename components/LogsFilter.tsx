import {without} from 'lodash-es';
import {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useAtom, useAtomValue} from 'jotai';
import {useTranslation} from 'react-i18next';
import DatePicker from 'react-native-date-picker';

import FilterSvg from '../assets/filter.svg';
import {filterAtom} from '../atoms/log';
import {LogType, logTypesAtom} from '../atoms/logType';
import {colors, colorValueForLogType} from '../colors';
import {useDateFormat} from '../i18n';

export function LogsFilter(): JSX.Element {
  const {t} = useTranslation();
  const [detailOpen, setDetailOpen] = useState(false);
  const bottomRef = useRef<BottomSheetModal | null>(null);
  const logTypes = useAtomValue(logTypesAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const dateFormat = useDateFormat();
  const open = useCallback(() => {
    setDetailOpen(true);
    bottomRef.current?.present();
  }, []);
  const close = useCallback(() => {
    setDetailOpen(false);
    bottomRef.current?.dismiss();
  }, []);
  const [dateOpen, setDateOpen] = useState<string>('');
  const [editingDate, setEditingDate] = useState<Date>(() => new Date());

  const updateFilterLogTypes = useCallback(
    (l: LogType) => {
      setFilter(f => {
        return {
          ...f,
          logTypes: f.logTypes?.includes(l)
            ? without(f.logTypes, l)
            : [...(f.logTypes ?? []), l],
        };
      });
    },
    [setFilter],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} />
      <TouchableHighlight
        onPress={() => {
          if (detailOpen) {
            close();
          } else {
            open();
          }
        }}
        underlayColor={colors.gray['700']}
        style={[styles.toggler, detailOpen ? styles.togglerActive : null]}>
        <FilterSvg
          width={30}
          height={30}
          fill={detailOpen ? colors.white : colors.gray['600']}
        />
      </TouchableHighlight>

      <BottomSheetModal
        snapPoints={['50%']}
        ref={bottomRef}
        onDismiss={() => setDetailOpen(false)}
        backdropComponent={renderBackdrop}
        index={0}>
        <BottomSheetScrollView>
          <View style={[styles.filterItem, styles.logTypeFilter]}>
            {logTypes.map(logType => {
              const color = colorValueForLogType(logType.color);
              const active =
                filter.logTypes && filter.logTypes.indexOf(logType) !== -1;

              return (
                <TouchableOpacity
                  key={logType.id}
                  activeOpacity={0.8}
                  style={[
                    styles.logTypeFilterItem,
                    {borderColor: color},
                    active ? {backgroundColor: color} : null,
                  ]}
                  onPress={() => {
                    updateFilterLogTypes(logType);
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.logTypeFilterText,
                      {color: active ? colors.white : color},
                    ]}>
                    {logType.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.filterItem, styles.dateFilter]}>
            <View style={styles.dateFilterItem}>
              <TouchableOpacity
                style={[styles.input, styles.dateFilterInput]}
                onPress={() => {
                  setDateOpen('from');
                  setEditingDate(filter.from ?? new Date());
                }}
                activeOpacity={0.6}>
                <Text>
                  {filter.from ? dateFormat.format(filter.from) : null}
                </Text>
              </TouchableOpacity>
              <Text style={styles.dateFilterText}>{t('filter.ahead')}</Text>
            </View>
            <View style={styles.dateFilterItem}>
              <TouchableOpacity
                style={[styles.input, styles.dateFilterInput]}
                onPress={() => {
                  setDateOpen('to');
                  setEditingDate(filter.to ?? new Date());
                }}
                activeOpacity={0.6}>
                <Text>{filter.to ? dateFormat.format(filter.to) : null}</Text>
              </TouchableOpacity>
              <Text style={styles.dateFilterText}>{t('filter.ago')}</Text>
            </View>

            {filter.from || filter.to ? (
              <TouchableOpacity
                style={styles.dateFilterClear}
                onPress={() => {
                  setFilter({...filter, from: undefined, to: undefined});
                }}>
                <Text>{t('filter.clearDate')}</Text>
              </TouchableOpacity>
            ) : null}

            <DatePicker
              modal
              open={Boolean(dateOpen)}
              date={editingDate}
              mode="date"
              onConfirm={(d: Date) => {
                if (dateOpen === 'from') {
                  let to = filter.to;

                  if (to && d >= to) {
                    to = d;
                  }

                  setFilter({...filter, from: d, to});
                } else {
                  let from = filter.from;

                  if (from && d < from) {
                    from = d;
                  }

                  setFilter({...filter, to: d, from});
                }

                setDateOpen('');
              }}
              onCancel={() => {
                setDateOpen('');
              }}
              androidVariant="iosClone"
              confirmText={t('confirm')}
              cancelText={t('cancel')}
              title={t('filter.selectDate')}
            />
          </View>

          <View style={[styles.filterItem, styles.containFilter]}>
            <View style={styles.containFilterItem}>
              <Text style={styles.containFilterText}>
                {t('filter.contain')}
              </Text>
              <TextInput
                style={[styles.input, styles.containFilterInput]}
                value={filter.contain ?? ''}
                onChangeText={v => setFilter(f => ({...f, contain: v}))}
              />
            </View>
            <View style={styles.containFilterItem}>
              <Text style={styles.containFilterText}>
                {t('filter.without')}
              </Text>
              <TextInput style={[styles.input, styles.containFilterInput]} />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray['100'],
    borderRadius: 10,
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  toggler: {
    width: 44,
    height: 32,
    backgroundColor: colors.gray['100'],
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  togglerActive: {
    backgroundColor: colors.gray['700'],
  },

  filterItem: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray['300'],
  },

  logTypeFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 0,
    paddingBottom: 10,
  },
  logTypeFilterItem: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  logTypeFilterItemActive: {},
  logTypeFilterText: {
    fontSize: 16,
  },

  dateFilter: {
    paddingBottom: 10,
  },
  dateFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateFilterInput: {
    maxWidth: '70%',
    marginRight: 10,
    justifyContent: 'center',
  },
  dateFilterText: {
    color: colors.black,
  },
  dateFilterClear: {},

  containFilter: {
    paddingBottom: 10,
  },
  containFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  containFilterInput: {
    maxWidth: '70%',
    marginRight: 10,
  },
  containFilterText: {
    color: colors.black,
    width: 60,
  },
});
