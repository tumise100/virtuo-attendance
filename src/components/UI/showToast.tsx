import {ToastAndroid} from 'react-native';

export enum ToastAndroidDuration {
  SHORT = 'SHORT',
  LONG = 'LONG',
}

export const showToast = (
  text: string,
  duration: ToastAndroidDuration = ToastAndroidDuration.LONG,
) => {
  return ToastAndroid.show(text, ToastAndroid[duration] || ToastAndroid.SHORT);
};
