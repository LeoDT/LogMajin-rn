import {StyleSheet, View} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {LogType} from '../atoms/logType';
import {colorValueForLogType} from '../colors';
import {iconContext} from '../utils/logType';

interface Props {
  logType: LogType;
  iconSize?: number;
  iconFill?: string;
}

export function LogTypeItemIconOnly({
  logType,
  iconSize = 45,
  iconFill = 'white',
}: Props): JSX.Element {
  const Icon = iconContext(logType.icon).default;

  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor: colorValueForLogType(logType.color)},
      ]}>
      <LinearGradient
        style={styles.item}
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.05)']}>
        <Icon width={iconSize} height={iconSize} fill={iconFill} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
