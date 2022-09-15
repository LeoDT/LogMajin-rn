/// <reference path="../node_modules/@types/webpack-env/index.d.ts" />
import {chunk} from 'lodash-es';
import {useMemo} from 'react';
import {StyleSheet, FlatList, View, Pressable} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';

import {colors} from '../colors';
import {iconContext} from '../utils/logType';

interface IconProps {
  icon: string;
  activeIcon: SharedValue<string>;
  onChange: (c: string) => void;
}

function Icon({icon, activeIcon, onChange}: IconProps) {
  // use animated to optimize performance

  const style = useAnimatedStyle(
    () => ({
      backgroundColor:
        activeIcon.value === icon ? colors.gray['200'] : 'transparent',
    }),
    [activeIcon],
  );
  const Component = useMemo(() => iconContext(icon).default, [icon]);

  return (
    <Pressable
      onPress={() => {
        activeIcon.value = icon;
        onChange(icon);
      }}>
      <Animated.View style={[styles.icon, style]}>
        <Component width={28} height={28} fill={colors.gray['700']} />
      </Animated.View>
    </Pressable>
  );
}

interface Props {
  value: string;
  onChange: (c: string) => void;
}

export function IconPicker({value, onChange}: Props): JSX.Element {
  const active = useSharedValue<string>(value);
  const iconCache = useMemo(() => {
    return iconContext.keys().map(p => ({
      id: p,
      element: (
        <Icon key={p} icon={p} activeIcon={active} onChange={onChange} />
      ),
    }));
  }, [active, onChange]);

  const data = useMemo(
    () =>
      chunk(iconCache, 4).map(c => ({
        id: c[0].id,
        render: () => c.map(e => e.element),
      })),
    [iconCache],
  );

  return (
    <FlatList
      horizontal
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      data={data}
      renderItem={({item}) => <View key={item.id}>{item.render()}</View>}
      maxToRenderPerBatch={20}
      onEndReachedThreshold={0.4}
    />
  );
}

const styles = StyleSheet.create({
  list: {},
  icon: {
    marginHorizontal: 3,
    marginBottom: 1,
    padding: 3,
    borderRadius: 6,
  },
  iconActive: {
    backgroundColor: colors.gray['400'],
  },
});
