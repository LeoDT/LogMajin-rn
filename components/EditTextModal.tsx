import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAtom} from 'jotai';
import {useCallback, useLayoutEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';

import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';

import {logTypeFamily} from '../atoms/logs';
import {HomeStackParamList} from '../types';

interface Props
  extends NativeStackScreenProps<HomeStackParamList, 'EditText'> {}

export function EditTextModal({route, navigation}: Props): JSX.Element {
  const [logType, setLogType] = useAtom(
    logTypeFamily({id: route.params.logTypeId}),
  );
  const [value, setValue] = useState(logType.content);
  const [selection, setSelection] = useState<{start: number; end: number}>({
    start: value.length,
    end: value.length,
  });
  const insert = useCallback(
    (t: string, selectionOffset?: {start: number; end: number}) => {
      const newValue = [
        value.slice(0, selection.start),
        t,
        value.slice(selection.end, value.length),
      ].join('');

      setValue(newValue);
      if (selectionOffset) {
        setSelection({
          start: selection.start + selectionOffset.start,
          end: selection.start + t.length + selectionOffset.end,
        });
      } else {
        setSelection({
          start: selection.start + t.length,
          end: selection.start + t.length,
        });
      }
    },
    [value, selection],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerTitle: '',
      headerRight: () => (
        <Button
          title="Save"
          onPress={() => {
            setLogType({...logType, content: value});
            navigation.goBack();
          }}
        />
      ),
    });
  }, [logType, value, navigation, setLogType]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={setValue}
          multiline
          style={styles.input}
          selection={selection}
          onSelectionChange={e => setSelection(e.nativeEvent.selection)}
        />
      </ScrollView>
      <KeyboardAccessoryView heightProperty="minHeight" androidAdjustResize>
        <View style={styles.keyboardAccessory}>
          <Pressable
            style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}
            onPress={() => insert('{{placeholder}}', {start: 2, end: -2})}>
            <Text style={styles.keyboardAccessoryButton}>Placeholder</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}
            onPress={() => insert('{{')}>
            <Text style={styles.keyboardAccessoryButton}>{'{{'}</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}
            onPress={() => insert('}}')}>
            <Text style={styles.keyboardAccessoryButton}>{'}}'}</Text>
          </Pressable>
        </View>
      </KeyboardAccessoryView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  inputWrapper: {
    flex: 1,
    flexGrow: 1,
    padding: 5,
  },
  input: {
    textAlignVertical: 'top',
    flexGrow: 1,
    flex: 1,
    fontSize: 18,
  },
  keyboardAccessory: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  keyboardAccessoryButton: {
    color: 'blue',
    marginEnd: 15,
    fontSize: 16,
  },
});
