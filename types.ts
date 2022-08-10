export type HomeStackParamList = {
  Create: undefined;
  EditLogType: {logTypeId: string};
  AddLog: {logTypeId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends HomeStackParamList {}
  }
}
