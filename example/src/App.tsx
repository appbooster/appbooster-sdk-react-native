import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import AppboosterSdk from 'appbooster-sdk-react-native';

const connectToAppboosterSDK = async () => {
  const connected = await AppboosterSdk.connect({
    appId: 'YOUR_APP_ID',
    sdkToken: 'YOUR_SDK_TOKEN',
    deviceId: 'YOUR_DEVICE_ID',
    appsFlyerId: 'YOUR_APPSFLYER_ID',
    amplitudeUserId: 'YOUR_AMPLITUDE_ID',
    usingShake: false,
    defaults: {
      ['TEST_1_KEY']: 'TEST_1_DEFAULT_VALUE',
      ['TEST_2_KEY']: 'TEST_2_DEFAULT_VALUE',
    },
    showLogs: false,
  });
  console.log('connected to AppboosterSdk: ', connected);

  const fetched = await AppboosterSdk.fetch();
  console.log('fetch experiments: ', fetched);

  const experiments = await AppboosterSdk.getExperiments();
  console.log('experiments : ', experiments);

  const experimentsWithDetails = await AppboosterSdk.getExperimentsWithDetails();
  console.log('experimentsWithDetails : ', experimentsWithDetails);

  const experiment = experiments['TEST_1_KEY'];
  console.log('experiment: ', experiment);

  const duration = await AppboosterSdk.getLastOperationDurationMillis();
  console.log('duration: ', duration);
};

const activateDebug = async () => {
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
      <Button title="activate Debug Mode" onPress={activateDebug} />
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
