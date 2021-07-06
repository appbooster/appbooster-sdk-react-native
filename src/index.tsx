import { NativeModules, Platform } from 'react-native';

const { AppboosterSdkReactNative } = NativeModules;

type Experiments = {
  [key: string]: string;
};

type UserDeviceProperties = {
  [key: string]: string | number | boolean | Date;
};

type SdkTypes = string | number | boolean;

type SdkDeviceProperties = {
  [key: string]: SdkTypes;
};

type SdkDevicePropertiesAndroid = {
  [key: string]: string;
};

type SDKSettings = {
  appId: string;
  sdkToken: string;
  deviceId: string;
  appsFlyerId: string | null;
  amplitudeUserId: string | null;
  deviceProperties: UserDeviceProperties;
  usingShake: boolean;
  defaults: Experiments;
  showLogs: boolean;
};

type AppboosterSdkReactNativeType = {
  connect(sdkSettings: SDKSettings): Promise<boolean>;
  fetch(): Promise<boolean>;
  getExperiments(): Promise<Experiments>;
  getExperimentsWithDetails(): Promise<Experiments>;
  getLastOperationDurationMillis(): Promise<number>;
  launchDebugMode(): Promise<boolean>;
};

const getType = (value: any = undefined): string => {
  const type =
    ({}.toString.call(value).match(/\s([a-z|A-Z]+)/)?.[1] as string) ?? '';
  return type.toLowerCase();
};

const getNumberForDeviceProperties = (number: number): number | string => {
  if (!Number.isFinite(number) || Number.isNaN(number)) {
    return `${number}`;
  }
  return number;
};

const stringifyDeviceProperties = (
  deviceProperties: SdkDeviceProperties
): SdkDevicePropertiesAndroid => {
  return Object.entries(deviceProperties).reduce<SdkDevicePropertiesAndroid>(
    (result, [key, value]) => {
      result[key] = `${value}`;
      return result;
    },
    {}
  );
};

const getSdkDeviceProperties = (
  deviceProperties: UserDeviceProperties
): SdkDeviceProperties => {
  return Object.entries(deviceProperties).reduce<SdkDeviceProperties>(
    (result, [key, value]) => {
      switch (getType(value)) {
        case 'string':
        case 'boolean':
          const otherTypeValue = (value?.valueOf?.() ?? value) as SdkTypes;
          result[key] = otherTypeValue;
          return result;
        case 'number':
          const number = (value?.valueOf?.() ?? value) as number;
          result[key] = getNumberForDeviceProperties(number);
          return result;
        case 'date':
          const date = (value as Date).toISOString();
          result[key] = date;
          return result;
        default:
          throw new Error(
            'AppboosterSdkReactNative: you can use only next data types for deviceProperties: String, Number, Boolean, Date'
          );
      }
    },
    {}
  );
};

class AppboosterSdk {
  connect = async ({
    appId = '',
    sdkToken = '',
    deviceId = '',
    appsFlyerId = null,
    amplitudeUserId = null,
    deviceProperties = {},
    usingShake = false,
    defaults = {},
    showLogs = false,
  }: SDKSettings): Promise<boolean> => {
    if (appId && sdkToken) {
      const sdkDeviceProperties = getSdkDeviceProperties(deviceProperties);
      return await AppboosterSdkReactNative.connect({
        appId: `${appId}`,
        sdkToken: `${sdkToken}`,
        deviceId,
        appsFlyerId,
        amplitudeUserId,
        deviceProperties:
          Platform.OS === 'android'
            ? stringifyDeviceProperties(sdkDeviceProperties)
            : sdkDeviceProperties,
        usingShake,
        defaults,
        showLogs,
      });
    }
    throw new Error(
      'AppboosterSdkReactNative: SDK must be initiated with an appId and sdkToken'
    );
  };

  fetch = async (): Promise<boolean> => {
    return await AppboosterSdkReactNative.fetch();
  };

  getExperiments = async (): Promise<Experiments> => {
    return await AppboosterSdkReactNative.getExperiments();
  };

  getExperimentsWithDetails = async (): Promise<Experiments> => {
    return await AppboosterSdkReactNative.getExperimentsWithDetails();
  };

  getLastOperationDurationMillis = async (): Promise<number> => {
    return await AppboosterSdkReactNative.getLastOperationDurationMillis();
  };

  launchDebugMode = async (): Promise<boolean> => {
    return await AppboosterSdkReactNative.launchDebugMode();
  };
}

export default new AppboosterSdk() as AppboosterSdkReactNativeType;
