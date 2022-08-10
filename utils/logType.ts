import {PlaceholderType} from '../atoms/logType';

export function showPlaceholderType(t: PlaceholderType) {
  switch (t) {
    case PlaceholderType.Text:
      return 'Text';
    case PlaceholderType.TextInput:
      return 'Text Input';
    case PlaceholderType.Select:
      return 'Select';
  }
}
