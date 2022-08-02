import {Animated, View, Pressable, StyleSheet, Text} from 'react-native';
import {
  NavigationState,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view';

function Tab({
  route,
  position,
  index,
  navigationState,
}: SceneRendererProps & {
  navigationState: NavigationState<Route>;
  route: Route;
  index: number;
}) {
  const inputRange = navigationState.routes.map((_, i) => i);

  const opacity = position.interpolate({
    inputRange,
    outputRange: inputRange.map((i: number) => (i === index ? 1 : 0.45)),
  });

  return (
    <Animated.View
      style={{
        opacity,
      }}>
      <Text
        style={[
          styles.label,
          navigationState.index === index ? styles.activeLabel : null,
        ]}>
        {route.title}
      </Text>
    </Animated.View>
  );
}

export function MainTab({
  navigationState,
  jumpTo,
  position,
  layout,
}: SceneRendererProps & {navigationState: NavigationState<Route>}) {
  return (
    <View style={styles.tabbar}>
      {navigationState.routes.map((route, index) => (
        <Pressable
          onPress={() => jumpTo(route.key)}
          style={styles.tab}
          key={route.key}>
          <Tab
            navigationState={navigationState}
            key={route.key}
            route={route}
            jumpTo={jumpTo}
            position={position}
            layout={layout}
            index={index}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingLeft: 5,
  },
  tab: {
    flexGrow: 0,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  label: {
    color: '#000',
    fontSize: 18,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
});
