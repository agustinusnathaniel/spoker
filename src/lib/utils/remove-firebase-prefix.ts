export const removeFirebasePrefix = (errMsg: string) => {
  const splitted = errMsg.split('Firebase: ');

  return splitted.length > 1 ? splitted[1] : splitted[0];
};
