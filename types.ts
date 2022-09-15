export type HomeStackParamList = {
  Home: undefined;
  EditLogType: {logTypeId: string};
  EditLogTypeColorAndIcon: {logTypeId: string};
  AddLog: {logTypeId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends HomeStackParamList {}
  }
}
