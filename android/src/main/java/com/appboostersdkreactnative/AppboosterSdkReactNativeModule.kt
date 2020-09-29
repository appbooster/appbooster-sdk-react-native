package com.appboostersdkreactnative

import com.appbooster.appboostersdk.AppboosterSdk
import com.facebook.react.bridge.*

class AppboosterSdkReactNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var sdk: AppboosterSdk? = null

    override fun getName(): String {
        return "AppboosterSdkReactNative"
    }

    @ReactMethod
    fun connect(settings: ReadableMap, promise: Promise) {
        val preparedSettings = Utils.prepareSetting(settings)

        val appId = preparedSettings.getString("appId") ?: ""
        val sdkToken = preparedSettings.getString("sdkToken") ?: ""
        val deviceId = preparedSettings.getString("deviceId") ?: ""
        val usingShake = preparedSettings.getBoolean("usingShake")
        val defaults = Utils.getDefaultExperiments(preparedSettings.getJSONObject("defaults"))
        val isInDevMode = preparedSettings.getBoolean("isInDevMode")

        if (currentActivity != null) {
            currentActivity!!.runOnUiThread(Runnable {
                sdk = AppboosterSdk.Builder(currentActivity!!.applicationContext)
                        .appId(appId)
                        .sdkToken(sdkToken)
                        .deviceId(deviceId)
                        .usingShake(usingShake)
                        .defaults(defaults)
                        .isInDevMode(isInDevMode)
                        .build()
                promise.resolve(true)
            })
        } else { promise.resolve(false) }
    }

    @ReactMethod
    fun fetch(promise: Promise) {
        sdk?.fetch(
                onSuccessListener = object: AppboosterSdk.OnSuccessListener{
                    override fun onSuccess() {
                        promise.resolve(Utils.prepareExperimentsForJS(sdk!!.experiments))
                    }
                },
                onErrorListener = object: AppboosterSdk.OnErrorListener{
                    override fun onError(th: Throwable) {
                        promise.resolve(Utils.prepareExperimentsForJS(sdk!!.experiments))
                    }
                }
        )
    }

    @ReactMethod
    fun getExperiments(promise: Promise) {
        promise.resolve(Utils.prepareExperimentsForJS(sdk!!.experiments))
    }

    @ReactMethod
    fun getLastOperationDurationMillis(promise: Promise) {
        promise.resolve(sdk!!.lastOperationDurationMillis.toDouble())
    }

    @ReactMethod
    fun launchDebugMode(promise: Promise) {
        promise.resolve(sdk!!.launchDebugMode(currentActivity!!.applicationContext))
    }
    
}
