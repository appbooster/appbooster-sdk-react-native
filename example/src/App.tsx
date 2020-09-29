import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppboosterSdk from 'appbooster-sdk-react-native';

const connectToAppboosterSDK = async () => {
  const connected = await AppboosterSdk.connect({
    appId: 'YOUR_APP_ID',
    sdkToken: 'YOUR_SDK_TOKEN',
    deviceId: 'YOUR_DEVICE_ID',
    usingShake: false,
    defaults: {
      ['TEST_1_KEY']: 'TEST_1_DEFAULT_VALUE',
      ['TEST_2_KEY']: 'TEST_2_DEFAULT_VALUE',
    },
    isInDevMode: false,
  });
  console.log('connected to AppboosterSdk: ', connected);

  const experiments = await AppboosterSdk.fetch();
  console.log('experiments init fetch: ', experiments);

  const cached_experiments = await AppboosterSdk.getExperiments();
  console.log('experiments cached value: ', cached_experiments);

  const duration = await AppboosterSdk.getLastOperationDurationMillis();
  console.log('duration: ', duration);

  const isDebugModeLaunched = await AppboosterSdk.launchDebugMode();
  console.log('isDebugModeLaunched: ', isDebugModeLaunched);
};

export default function App() {
  React.useEffect(() => {
    connectToAppboosterSDK();
  }, []);

  return (
    <View style={styles.container}>
      <Text>AppboosterSdk test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
