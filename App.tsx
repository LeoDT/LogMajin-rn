import {StatusBar, StyleSheet} from 'react-native';

import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAtomsDebugValue} from 'jotai/devtools';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AddLogModal} from './components/AddLogModal';
import {EditLogTypeColorAndIcon} from './components/EditLogTypeColorAndIcon';
import {EditLogTypeModal} from './components/EditLogTypeModal';
import {HomeScreen} from './components/HomeScreen';
import {HomeStackParamList} from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function App() {
  useAtomsDebugValue();

  return (
    <>
      <StatusBar animated backgroundColor="#fff" barStyle="dark-content" />

      <GestureHandlerRootView style={styles.root}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <ActionSheetProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: '#fff',
                    },
                  }}>
                  <Stack.Group>
                    <Stack.Screen name="Home" component={HomeScreen} />
                  </Stack.Group>

                  <Stack.Group
                    screenOptions={{
                      presentation: 'modal',
                    }}>
                    <Stack.Screen
                      name="EditLogType"
                      component={EditLogTypeModal}
                    />
                    <Stack.Screen
                      name="EditLogTypeColorAndIcon"
                      component={EditLogTypeColorAndIcon}
                    />

                    <Stack.Screen name="AddLog" component={AddLogModal} />
                  </Stack.Group>
                </Stack.Navigator>
              </NavigationContainer>
            </ActionSheetProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
