import {createContextNoNullCheck} from '../utils/react';

export const [useLogTypeTheme, LogTypeThemeContext] =
  createContextNoNullCheck<string>('');
