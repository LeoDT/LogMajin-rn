import {useSetAtom} from 'jotai';
import {Button} from 'react-native';
import {createLogTypeAtom} from '../atoms/logType';

export function CreateLogButton(): JSX.Element {
  const create = useSetAtom(createLogTypeAtom);

  return <Button title="New Type" onPress={() => create()} />;
}
