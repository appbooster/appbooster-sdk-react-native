# appbooster-sdk-react-native

React Native wrapper for Appbooster SDK ([ios](https://github.com/appbooster/appbooster-sdk-ios), [android](https://github.com/appbooster/appbooster-sdk-android))

## Installation

### Common steps

#### install library

Yarn:

```sh
yarn add appbooster-sdk-react-native
```

npm:

```sh
npm install --save appbooster-sdk-react-native
```

### Platform-specific steps

#### iOS

##### use_frameworks! usage

If your project use `use_frameworks!` (we can use it from RN >= 0.61, `Podfile` exist in your project and contains uncommented `use_frameworks!` line) see [Pods usage section](#pods-usage)

If your project doesn't use `use_frameworks!` make sure that you have Swift integration in your project. If you have no Swift integration in your project you need to integrate Swift in your porject:

1. In XCode, in the project navigator, right click your `[your project's name]` folder, choose ➜ `Add Files to [your project's name]`

![Create Swift File](https://i.imgur.com/00K5UZ1.png)

2. Select `Swift File` ➜ `Next`

![Create Swift File](https://i.imgur.com/Mdc9MLk.png)

3. Specify name for example `Dummy.swift` ➜ `Create`

![Create Swift File](https://i.imgur.com/2HSk7Jp.png)

4. Now a pop up is shown select `Create Bridging Header`

![Create Swift File](https://i.imgur.com/f2zA0n9.png)

5. See [Pods usage section](#pods-usage)

##### Pods usage

**if you are using Pods** (used by default since the RN >= 0.60, `Podfile` exist in your project):

```bash
cd ios && pod install
```

**if you are NOT using Pods**:  
see docs about linking library [manually](https://reactnative.dev/docs/linking-libraries-ios#manual-linking)

**NOTE**:  
More info about linking iOS library you can see [here](https://reactnative.dev/docs/linking-libraries-ios)  
More info about **autolinking** mechanism in iOS you can see [here](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#platform-ios)

#### Android

if you are using [autolonking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#platform-android) (used by default since the RN >= 0.60) you **no need to do anything**!

if you are **NOT** using autolinking follow next steps:

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

- Add `import com.appboostersdkreactnative.AppboosterSdkReactNativePackage;` to the imports at the top of the file
- Add `new AppboosterSdkReactNativePackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:

   ```android
   include ':appbooster-sdk-react-native'
   project(':appbooster-sdk-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/appbooster-sdk-react-native/android')
   ```

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`: `implementation project(':appbooster-sdk-react-native')`

**NOTE**: if you want to link library manually in project with autolinking support see info [here](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md#how-can-i-disable-autolinking-for-unsupported-library)

## Usage

```js
import AppboosterSdk from 'appbooster-sdk-react-native';
```

### Initialization:

```js
const connected = await AppboosterSdk.connect({
  appId: 'YOUR_APP_ID',
  sdkToken: 'YOUR_SDK_TOKEN',
  deviceId: 'YOUR_DEVICE_ID', // optional, UUID generated by default
  usingShake: false, // false by default, cause React Native already uses shake motion in debug mode for own purposes (show React Native debug window after shaking your device)
  defaults: {
    ['TEST_1_KEY']: 'TEST_1_DEFAULT_VALUE',
    ['TEST_2_KEY']: 'TEST_2_DEFAULT_VALUE',
  },
}); // boolean
```

### How to fetch known test values that associated with your device?

```js
const experiments = await AppboosterSdk.fetch(); // list of experiments (initial fetch to server)
```

### How to get the value for a specific test?

```js
const value = experiments['TEST_1_KEY']; // string
```

In case of problems with no internet connection or another, the values obtained in the previous session will be used, or if they are missing, the default values specified during initialization will be used.

### How to get user tests for analytics?

```js
const experiments = await AppboosterSdk.getExperiments(); // list of experiments (cached values after initial fetch to server)

// i.e. set Amplitude user properties
const amplitude = new RNAmplitude('Your Amplitude key');
amplitude.setUserProperties(experiments);
```

### How to debug?

Before debug make sure that debug-mode for your App is turned-on on [settings page](https://platform.appbooster.com/ab/settings)

![](https://imgproxy.appbooster.com/9ACImnEbmsO822dynjTjcC_B8aXzbbpPQsOgop2PlBs//aHR0cHM6Ly9hcHBib29zdGVyLWNsb3VkLnMzLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tLzk0N2M5NzdmLTAwY2EtNDA1Yi04OGQ4LTAzOTM4ZjY4OTAzYi5wbmc.png)

```js
const connected = await AppboosterSdk.connect({
  //...
  isInDevMode: true, // false by default, to print all debugging info in the console (you can see logs in XCode or Android Studio)
  //...
});

const duration = await AppboosterSdk.getLastOperationDurationMillis(); // number (the duration of the last operation in milliseconds)
```

In debug mode you can see all actual tests and check how the user will see each option of the test. To show the debug activity you just need to turn it on in your personal cabinet and call

```js
const isDebugModeLaunched = await AppboosterSdk.launchDebugMode(); // boolean
```

#### Platform specific (optional info for React Native project)

You can find more info about debug menu usage in iOS and Android here: [ios](https://github.com/appbooster/appbooster-sdk-ios#how-to-debug), [android](https://github.com/appbooster/appbooster-sdk-android#how-to-debug))

==================================================

You can see the example of usage [here](example)  
For additional info you also can see docs of native Appbooster SDK ([ios](https://github.com/appbooster/appbooster-sdk-ios), [android](https://github.com/appbooster/appbooster-sdk-android))

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
