import {Provider} from 'jotai';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {HomeScreen} from './components/HomeScreen';
import {EditLogTypeModal} from './components/EditLogTypeModal';
import {EditTextModal} from './components/EditTextModal';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider>
      <SafeAreaProvider>
        <ActionSheetProvider>
          <GestureHandlerRootView style={styles.root}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  statusBarColor: '#fff',
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

                  <Stack.Screen name="EditText" component={EditTextModal} />
                </Stack.Group>
              </Stack.Navigator>
            </NavigationContainer>
          </GestureHandlerRootView>
        </ActionSheetProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
