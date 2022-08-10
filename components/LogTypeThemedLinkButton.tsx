import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {colors} from '../colors';
import {useLogTypeTheme} from './LogTypeThemeColorContext';

interface Props extends TouchableOpacityProps {
  title: string;
  titleStyle?: TextStyle;
  isDisabled?: boolean;
}

export function LogTypeThemedLinkButton({
  title,
  titleStyle,
  isDisabled,
  ...props
}: Props): JSX.Element {
  const themeColor = useLogTypeTheme();

  return (
    <TouchableOpacity {...props}>
      <Text
        style={[
          styles.text,
          {color: isDisabled ? colors.gray['600'] : themeColor},
          titleStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
});
