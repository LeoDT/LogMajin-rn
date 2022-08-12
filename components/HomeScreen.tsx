import {useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap} from 'react-native-tab-view';

import {CreateScreen} from './CreateScreen';
import {LogsScreen} from './LogsScreen';
import {MainTab} from './MainTab';

const renderScene = SceneMap({
  create: CreateScreen,
  logs: LogsScreen,
});

export function HomeScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'create', title: 'Create'},
    {key: 'logs', title: 'Logs'},
  ]);

  return (
    <SafeAreaView style={styles.base}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={props => <MainTab {...props} />}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
