import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

import CloseSvg from '../assets/close.svg';
import {colors} from '../colors';

export function Close(props: TouchableOpacityProps): JSX.Element {
  return (
    <TouchableOpacity {...props}>
      <CloseSvg width={28} height={28} fill={colors.gray['400']} />
    </TouchableOpacity>
  );
}
