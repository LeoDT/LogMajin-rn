import {useCallback, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAtom} from 'jotai';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, Route as TabViewRoute} from 'react-native-tab-view';

import {logTypeFamily} from '../atoms/logType';
import {colors, colorValueForLogType} from '../colors';
import {HomeStackParamList} from '../types';
import {ColorPicker} from './ColorPicker';
import {IconPicker} from './IconPicker';
import {LogTypeItemIconOnly} from './LogTypeItemIconOnly';
import {LogTypeThemeContext} from './LogTypeThemeColorContext';
import {LogTypeThemedLinkButton} from './LogTypeThemedLinkButton';
import {MainTab} from './MainTab';

type Props = NativeStackScreenProps<
  HomeStackParamList,
  'EditLogTypeColorAndIcon'
>;

export function EditLogTypeColorAndIcon({
  navigation,
  route,
}: Props): JSX.Element {
  const logTypeAtom = logTypeFamily({id: route.params.logTypeId});
  const [logType, setLogType] = useAtom(logTypeAtom);
  const onIconChange = useCallback(
    (icon: string) => setLogType({icon}),
    [setLogType],
  );

  const renderScene = useCallback(
    (renderProps: {route: TabViewRoute}) => {
      switch (renderProps.route.key) {
        case 'color':
          return (
            <ColorPicker
              value={logType.color}
              onChange={color => setLogType({color})}
            />
          );
        case 'icon':
          return <IconPicker value={logType.icon} onChange={onIconChange} />;
        default:
          return null;
      }
    },
    [logType, setLogType, onIconChange],
  );

  const layout = useWindowDimensions();
  const {t} = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'color', title: t('editLogTypeColorTab')},
    {key: 'icon', title: t('editLogTypeIconTab')},
  ]);

  return (
    <LogTypeThemeContext.Provider value={colorValueForLogType(logType.color)}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <LogTypeThemedLinkButton
            title={t('done')}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.preview}>
          <View style={styles.icon}>
            <LogTypeItemIconOnly logType={logType} />
          </View>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={props => <MainTab {...props} isCenter />}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          swipeEnabled={false}
          style={styles.tabContainer}
        />
      </SafeAreaView>
    </LogTypeThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  preview: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.gray['100'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
  },
  tabContainer: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 200,
  },
});
