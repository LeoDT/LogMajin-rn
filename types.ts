export type HomeStackParamList = {
  Create: undefined;
  EditLogType: {logTypeId: string};
  EditText: {logTypeId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends HomeStackParamList {}
  }
}
