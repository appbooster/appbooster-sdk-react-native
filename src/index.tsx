import { NativeModules, Platform } from 'react-native';

const { AppboosterSdkReactNative } = NativeModules;

type Experiments = {
  [key: string]: string;
};

type DefaultTypes = string | number | boolean | null;

type DefaultArrayType = (
  | DefaultTypes
  | DevicePropertiesIOS
  | DefaultArrayType
)[];

type DevicePropertiesIOS = {
  [key: string]: DefaultTypes | DevicePropertiesIOS | DefaultArrayType;
};

type DevicePropertiesAndroid = {
  [key: string]: string;
};

type UserDeviceProperties = {
  [key: string]: any;
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

const prepareObjectForNativeAndroid = (
  deviceProperties: UserDeviceProperties
): DevicePropertiesAndroid => {
  return Object.entries(deviceProperties).reduce<DevicePropertiesAndroid>(
    (result, [key, value]) => {
      switch (getType(value)) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'null':
          result[key] = `${value?.valueOf?.() ?? value}`;
          return result;
        case 'array':
        case 'object':
          result[key] = JSON.stringify(value);
          return result;
        case 'undefined':
          result[key] = 'null';
          return result;
        default:
          return result;
      }
    },
    {}
  );
};

const prepareObjectForNativeIOS = (
  deviceProperties: UserDeviceProperties
): DevicePropertiesIOS => {
  return Object.entries(deviceProperties).reduce<DevicePropertiesIOS>(
    (result, [key, value]) => {
      switch (getType(value)) {
        case 'string':
        case 'boolean':
        case 'null':
          const otherTypeValue = (value?.valueOf?.() ?? value) as DefaultTypes;
          result[key] = otherTypeValue;
          return result;
        case 'number':
          const number = (value?.valueOf?.() ?? value) as number;
          result[key] = prepareNumberForNativeIOS(number);
          return result;
        case 'array':
          const arrayValue = value as any[];
          result[key] = prepareArrayForNativeIOS(arrayValue);
          return result;
        case 'object':
          const objectValue = value as UserDeviceProperties;
          result[key] = prepareObjectForNativeIOS(objectValue);
          return result;
        case 'undefined':
          result[key] = null;
          return result;
        default:
          return result;
      }
    },
    {}
  );
};

const prepareArrayForNativeIOS = (arr: any[]): DefaultArrayType => {
  return arr.reduce<DefaultArrayType>((result, value) => {
    switch (getType(value)) {
      case 'string':
      case 'boolean':
      case 'null':
        const otherTypeValue = (value?.valueOf?.() ?? value) as DefaultTypes;
        result.push(otherTypeValue);
        return result;
      case 'number':
        const number = (value?.valueOf?.() ?? value) as number;
        result.push(prepareNumberForNativeIOS(number));
        return result;
      case 'array':
        const arrayValue = value as any[];
        result.push(prepareArrayForNativeIOS(arrayValue));
        return result;
      case 'object':
        const objectValue = value as UserDeviceProperties;
        result.push(prepareObjectForNativeIOS(objectValue));
        return result;
      case 'undefined':
        result.push(null);
        return result;
      default:
        return result;
    }
  }, []);
};

const prepareNumberForNativeIOS = (number: number): number | string => {
  if (!Number.isFinite(number) || Number.isNaN(number)) {
    return `${number}`;
  }
  return number;
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
      return await AppboosterSdkReactNative.connect({
        appId: `${appId}`,
        sdkToken: `${sdkToken}`,
        deviceId,
        appsFlyerId,
        amplitudeUserId,
        deviceProperties:
          Platform.OS === 'android'
            ? prepareObjectForNativeAndroid(deviceProperties)
            : prepareObjectForNativeIOS(deviceProperties),
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
