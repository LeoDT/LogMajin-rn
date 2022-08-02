import {useAtomValue} from 'jotai';
import {Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {logTypeFamily} from '../atoms/logs';
import {colors} from '../colors';

import HeartPulseSvg from '../assets/heart-pulse.svg';
import MoreSvg from '../assets/more.svg';

interface Props {
  logTypeId: string;
}

export function LogTypeItem({logTypeId}: Props): JSX.Element {
  const navigation = useNavigation();
  const logTypeAtom = logTypeFamily({id: logTypeId});
  const logType = useAtomValue(logTypeAtom);
  const color = colors[logType.color]['800'];

  return (
    <Pressable style={[styles.wrapper, {backgroundColor: color}]}>
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
            navigation.navigate('EditLogType', {logTypeId});
          }}>
          <MoreSvg width={25} height={25} fill={color} />
        </Pressable>

        <HeartPulseSvg
          width={45}
          height={45}
          fill="white"
          style={styles.icon}
        />
      </LinearGradient>
    </Pressable>
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
