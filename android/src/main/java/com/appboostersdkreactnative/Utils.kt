package com.appboostersdkreactnative

import com.appbooster.appboostersdk.Experiment

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap

import org.json.JSONException
import org.json.JSONObject

internal object Utils {
    @Throws(JSONException::class)
    fun prepareSetting(settings: ReadableMap?): JSONObject {
        return fromReadableMapToJSONObject(settings)
    }

    @Throws(JSONException::class)
    fun getDefaultExperiments(defaults: JSONObject): Map<String, String> {
        return fromJSONObjectToMap(defaults)
    }

    fun prepareExperimentsForJS(experiments: Map<String, String>): WritableMap {
        val preparedExperiments = Arguments.createMap()

        for((key, value) in experiments){
            preparedExperiments.putString(key, value);
        }

        return preparedExperiments
    }

    @Throws(JSONException::class)
    private fun fromReadableMapToJSONObject(readableMap: ReadableMap?): JSONObject {
        val jsonObject = JSONObject()
        val iterator = readableMap!!.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            when (readableMap.getType(key)) {
                ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
                ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
                ReadableType.Map -> jsonObject.put(key, fromReadableMapToJSONObject(readableMap.getMap(key)))
                else -> {}
            }
        }
        return jsonObject
    }

    @Throws(JSONException::class)
    private fun fromJSONObjectToMap(jsonObject: JSONObject): Map<String, String> {
        val map: MutableMap<String, String> = HashMap()
        val iterator: Iterator<String> = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            val value = jsonObject.get(key)
            if (value is String) {
                map[key] = value
            }
        }
        return map
    }
}