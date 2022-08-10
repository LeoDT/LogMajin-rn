import React from 'react';

import {SvgProps} from 'react-native-svg';

import {useLogTypeTheme} from './LogTypeThemeColorContext';

interface Props extends SvgProps {
  IconComponent: React.FC<SvgProps>;
}

export function LogTypeThemedIcon({
  IconComponent,
  ...props
}: Props): JSX.Element {
  const themeColor = useLogTypeTheme();

  return <IconComponent fill={themeColor} {...props} />;
}
