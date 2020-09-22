import { NativeModules } from 'react-native';

const { AppboosterSdkReactNative } = NativeModules;

type Experiments = {
  [key: string]: string;
};

type SDKSettings = {
  appId: string;
  sdkToken: string;
  deviceId: string;
  usingShake: boolean;
  defaults: Experiments;
  isInDevMode: boolean;
};

type AppboosterSdkReactNativeType = {
  connect(sdkSettings: SDKSettings): Promise<boolean>;
  fetch(): Promise<Experiments>;
  getLastOperationDurationMillis(): Promise<number>;
  launchDebugMode(): Promise<boolean>;
};

class AppboosterSdk {
  connect = async ({
    appId = '',
    sdkToken = '',
    deviceId = '',
    usingShake = false,
    defaults = {},
    isInDevMode = false,
  }: SDKSettings): Promise<boolean> => {
    return await AppboosterSdkReactNative.connect({
      appId,
      sdkToken,
      deviceId,
      usingShake,
      defaults,
      isInDevMode,
    });
  };

  fetch = async (): Promise<Experiments> => {
    return await AppboosterSdkReactNative.fetch();
  };

  getLastOperationDurationMillis = async (): Promise<number> => {
    return await AppboosterSdkReactNative.getLastOperationDurationMillis();
  };

  launchDebugMode = async (): Promise<boolean> => {
    return await AppboosterSdkReactNative.launchDebugMode();
  };
}

export default new AppboosterSdk() as AppboosterSdkReactNativeType;
