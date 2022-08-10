import {useSetAtom} from 'jotai';
import {StyleSheet, Text, View, TextInput} from 'react-native';

import {
  LogType,
  Placeholder,
  PlaceholderType,
  updatePlaceholderAtom,
} from '../atoms/logType';
import {colors} from '../colors';
import {showPlaceholderType} from '../utils/logType';

import MoreSvg from '../assets/more.svg';

import {SelectOptionsEditor} from './SelectOptionsEditor';

interface Props {
  logType: LogType;
  placeholder: Placeholder;
}

export function LogTypePlaceholderEditor({
  logType,
  placeholder,
}: Props): JSX.Element {
  const updatePlaceholder = useSetAtom(updatePlaceholderAtom);

  const renderDetail = () => {
    switch (placeholder.kind) {
      case PlaceholderType.Text:
        return (
          <TextInput
            style={styles.editorText}
            placeholder="blah blah"
            value={placeholder.content}
            onChangeText={v => {
              updatePlaceholder({
                logTypeId: logType.id,
                placeholder,
                update: {
                  content: v,
                },
              });
            }}
            multiline
          />
        );
      case PlaceholderType.Select:
        return (
          <SelectOptionsEditor
            options={placeholder.options}
            onChange={options =>
              updatePlaceholder({
                logTypeId: logType.id,
                placeholder,
                update: {
                  options,
                },
              })
            }
          />
        );
      case PlaceholderType.TextInput:
        return null;
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      {placeholder.kind !== PlaceholderType.Text ? (
        <TextInput
          style={styles.name}
          value={placeholder.name}
          placeholder="Name"
        />
      ) : null}

      {renderDetail()}

      <View style={styles.metas}>
        <Text style={styles.type}>{showPlaceholderType(placeholder.kind)}</Text>

        <MoreSvg
          style={styles.more}
          width={20}
          height={20}
          fill={colors.gray['500']}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 2,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    padding: 0,
  },
  metas: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    width: '100%',
    height: 30,
  },
  type: {
    color: colors.gray['600'],
  },
  more: {
    marginLeft: 'auto',
  },

  editorText: {
    textAlignVertical: 'top',
    fontSize: 18,
    padding: 0,
  },
});
