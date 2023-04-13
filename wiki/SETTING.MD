This page explains how to use settings and how to create new ones

## Inner Workings

The SettingManager singleton class contains every setting instantiated in an object
A setting have a type which corresponds to the type of the value that it stores, 
each setting is linked to the browser's web storage and will load the value
stored in the browser's local storage if it exists or fallback to the specified default value.

Each setting is able to modify its linked browser's value which will then call
every callback functions of its subscribers when the setting's value changes
when its setValue method is called.

## Using a setting
To use a setting we need to first access it through the singleton class SettingsManager as follows
```ts
SettingsManager.instance.getSetting("dummy-setting-key");
```
We can then either set its value or get its value
```ts
// Fetches the setting from the SettingsManager
let dummySetting = SettingsManager.instance.getSetting("dummy-setting-key");

// Sets the setting value, changing it in the browser's local storage
// And calls every subscriber's callbacks with the new value as the first parameter
dummySetting.value = "foo";

// Gets the value of the setting.
dummySetting.value;
```

To subscribe to a setting and react when its value changes we can do as follows
```ts
// Fetches the setting from the SettingsManager
let dummySetting = SettingsManager.instance.getSetting("dummy-setting-key");

// Adds a new callback subscriber to the setting
dummySetting.subscribe((newVal) => {
    // Callback called when the setting value changes
    console.log(newVal);
});
```
This snippet adds the anonymous function to the dummySetting callback list
which will on each call of the setValue method, invoke all subscribed callbacks
with the new value of the setting as the first parameter

## Creating a new setting
To create a new setting, we need to append it in the settings.json file as follows

```json
{
    "dummy-setting-key" : {
        "defaultValue": "dummySettingDefaultvalue"
    }
}
```
Then we can access it through the SettingsManager as follows
```ts
SettingsManager.instance.getSetting("dummy-setting-key");
```