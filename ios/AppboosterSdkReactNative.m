#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AppboosterSdkReactNative, NSObject)

RCT_EXTERN_METHOD(connect:(NSDictionary *)sdkSettings
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetch:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getExperiments:(BOOL)addAppboosterPrefix
                withResolver:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLastOperationDurationMillis:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(launchDebugMode:(RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

@end
