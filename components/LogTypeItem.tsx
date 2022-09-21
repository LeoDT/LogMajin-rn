import {useCallback} from 'react';
import {Text, StyleSheet, View, Pressable} from 'react-native';

import {useActionSheet} from '@expo/react-native-action-sheet';
import {useNavigation} from '@react-navigation/native';
import {useAtomValue, useSetAtom} from 'jotai';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import MoreSvg from '../assets/more.svg';
import {archiveLogTypeAtom, logTypeFamily} from '../atoms/logType';
import {colors} from '../colors';
import {iconContext} from '../utils/logType';

interface Props {
  logTypeId: string;
}

export function LogTypeItem({logTypeId}: Props): JSX.Element {
  const navigation = useNavigation();

  const {t} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();

  const logTypeAtom = logTypeFamily({id: logTypeId});
  const logType = useAtomValue(logTypeAtom);
  const archiveLogType = useSetAtom(archiveLogTypeAtom);
  const color = colors[logType.color]['800'];
  const Icon = iconContext(logType.icon)?.default;

  const actions = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: [t('edit'), t('archive'), t('cancel')],
        cancelButtonIndex: 2,
      },
      i => {
        switch (i) {
          case 0:
            navigation.navigate('EditLogType', {logTypeId});
            break;
          case 1:
            archiveLogType({logTypeId});
            break;
        }
      },
    );
  }, [showActionSheetWithOptions, t, navigation, logTypeId, archiveLogType]);

  return (
    <View style={[styles.wrapper, {backgroundColor: color}]}>
      <LinearGradient
        style={styles.item}
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.05)']}>
        <Text style={styles.name}>{logType.name}</Text>

        <Pressable
          style={({pressed}) => [
            styles.more,
            pressed ? styles.morePressed : null,
          ]}
          onPress={() => {
            actions();
          }}>
          <MoreSvg width={25} height={25} fill={color} />
        </Pressable>

        {Icon ? (
          <Icon width={45} height={45} fill="white" style={styles.icon} />
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
  },
  item: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  name: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  more: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  morePressed: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
