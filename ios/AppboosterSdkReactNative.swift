import AppboosterSDK

@objc(AppboosterSdkReactNative)
class AppboosterSdkReactNative: NSObject {
    
    private var sdk: AppboosterSDK!

    @objc(connect:withResolver:withRejecter:)
    func connect(sdkSettings:[String: Any],
                 resolve: @escaping RCTPromiseResolveBlock,
                 reject: @escaping RCTPromiseRejectBlock) -> Void {
        let appId = sdkSettings["appId"] as? String ?? ""
        let sdkToken = sdkSettings["sdkToken"] as?  String ?? ""
        let deviceId = sdkSettings["deviceId"] as? String ?? ""
        let usingShake = sdkSettings["usingShake"] as? Bool ?? false
        let defaults = sdkSettings["defaults"] as? [String: String] ?? [:]
        let showLogs = sdkSettings["showLogs"] as? Bool ?? false
        let appsFlyerId = sdkSettings["appsFlyerId"] as? String ?? nil
        let amplitudeUserId = sdkSettings["amplitudeUserId"] as? String ?? nil
        let deviceProperties = sdkSettings["deviceProperties"] as? [String: Any] ?? [:]

        sdk = AppboosterSDK(
            sdkToken: sdkToken,
            appId: appId,
            // NOTE: can SDK handles empty deviceId?
            deviceId: deviceId.isEmpty ? nil : deviceId,
            deviceProperties: deviceProperties,
            appsFlyerId: appsFlyerId,
            amplitudeUserId: amplitudeUserId,
            usingShake: usingShake,
            defaults: defaults
        )
        /* NOTE: no analog for "AppboosterDebugMode.isOn"
                 and "ab.log = { text in }" in Android SDK
                 or it is not documented.
        */
        sdk!.showDebug = showLogs
        resolve(true)
    }
    
    @objc(fetch:withRejecter:)
    func fetch(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) -> Void {
        sdk!.fetch(completion: { error in
            resolve(error == nil)
        })
    }

    @objc(getExperiments:withRejecter:)
    func getExperiments(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(sdk!.experiments())
    }
    
    @objc(getExperimentsWithDetails:withRejecter:)
    func getExperimentsWithDetails(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) -> Void {
        // TODO: works uncorrectly and can't iterate elements through loop
        resolve(sdk!.experimentsWithDetails())
    }
    
    @objc(getLastOperationDurationMillis:withRejecter:)
    func getLastOperationDurationMillis(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(sdk!.lastOperationDuration)
    }
    
    @objc(launchDebugMode:withRejecter:)
    func launchDebugMode(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            guard let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
            else {
                resolve(false)
                return
            }
            AppboosterDebugMode.showMenu(from: rootViewController)
            resolve(true)
        }
    }
}
