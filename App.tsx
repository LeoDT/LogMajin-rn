import {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';

import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSetAtom} from 'jotai';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {loadLogTypesAtom} from './atoms/logType';
import {AddLogModal} from './components/AddLogModal';
import {EditLogTypeModal} from './components/EditLogTypeModal';
import {HomeScreen} from './components/HomeScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [inited, setInited] = useState(false);
  const loadLogTypes = useSetAtom(loadLogTypesAtom);

  useEffect(() => {
    (async () => {
      await loadLogTypes();

      setInited(true);
    })();
  }, [loadLogTypes]);

  return inited ? (
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

                    <Stack.Screen name="AddLog" component={AddLogModal} />
                  </Stack.Group>
                </Stack.Navigator>
              </NavigationContainer>
            </ActionSheetProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  ) : null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
