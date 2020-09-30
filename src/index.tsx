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
  showLogs: boolean;
};

type AppboosterSdkReactNativeType = {
  connect(sdkSettings: SDKSettings): Promise<boolean>;
  fetch(): Promise<boolean>;
  getExperiments(): Promise<Experiments>;
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
    showLogs = false,
  }: SDKSettings): Promise<boolean> => {
    return await AppboosterSdkReactNative.connect({
      appId,
      sdkToken,
      deviceId,
      usingShake,
      defaults,
      showLogs,
    });
  };

  fetch = async (): Promise<boolean> => {
    return await AppboosterSdkReactNative.fetch();
  };

  getExperiments = async (): Promise<Experiments> => {
    return await AppboosterSdkReactNative.getExperiments();
  };

  getLastOperationDurationMillis = async (): Promise<number> => {
    return await AppboosterSdkReactNative.getLastOperationDurationMillis();
  };

  launchDebugMode = async (): Promise<boolean> => {
    return await AppboosterSdkReactNative.launchDebugMode();
  };
}

export default new AppboosterSdk() as AppboosterSdkReactNativeType;
