A module is an independent part of the extension that can alter its behaviour
by adding new features

## Creating a module

### Module Architecture

A module is located in the modules/ folder, its designed following the following
template : <br>
**\* : Required**

```
ModuleName
|-- locales
|   |-- en
|       |-- translations.json
|   |-- vi
|       |-- translations.json
|
|-- assets
|   |-- asset1.png
|   |-- asset2.json
|
|-- styles
|   |-- moduleName.scss
|
|-- tests
|   |-- module.test.ts(x)
|
|-- ModuleName.tsx *
|-- module.json    *
|-- index.ts       *
```

### Creating a module

#### **Essential files**
Each module must have at least the following structure

```
moduleName
|-- ModuleName.ts(x)
|-- module.json
|-- index.ts
```

#### **ModuleName.ts(x)**
This file contains the creation of the Module class instance which must then
be registered in the ModulesManager singleton

Here is an example of this file
```tsx
import { Module, ModulesManager } from "Modules/base";
import moduleJSON from "./module.json";
import React from "react";


// Creating Module instance -> Mandatory
const dummyModule = new Module(
    moduleJSON,
    () => {/*On module enable callback -> Optional*/},
    () => {/*On module disable callback -> Optional*/}
);

// Optional
dummyModule.settingsSectionElement = 
    <>
        {
            /**
             * Elements here are the custom settings page that will be 
             * displayed in the module's section inside of the module's
             * tab in the settings pannel
             */
        }
    </>;

// Optional
dummyModule.rootElement = 
    <>
        {
            /**
             * Elements here will be displayed in the react-target tag
             */
        }
    </>;
    
// Registering the module in the modules manager -> mandatory
ModulesManager.instance.register(dummyModule);

// Exporting the module -> mandatory
export { dummyModule };
```

#### **index.ts**
This file is used to expose the module to the rest of the extension, in it
you must at least export the file containing the instance of the module class.

```ts
export * from "./dummyModule";
```

#### **module.json**
This file is used to store the module info and settings, it must
be defined as follows :
```json
{
    "name" : "dummyModule",                            
    "title": "dummy-module-title",
    "desc": "dummy-module-desc",
    "supported-languages": ["en", "fr"],
    "iconURL": "app-ressources/dummyModule.svg",
    "status-setting" : {
        "key": "dummy-module-activated-boolean",
        "defaultValue": true
    },
    "settings" : {
        "dummySetting" : {
            "defaultValue": "dummyValue"
        },
        "dummySetting1" : {
            "defaultValue": "dummyValue1"
        }
    }
}
```
> **name** : The name of the module, it **MUST** correspond to the module's
> folder name and must must not contain spaces or special characters.

> **title** : Title of the module displayed in the modules page of the setting panel
> , it can be translated if a i18n's translation key is passed,
> cf. [Translating](#translating) 

> **desc** : Description of the module displayed in the modules page of the setting
> panel, it can be translated if a i18n's translation key is passed,
> cf. [Translating module](#translating) 

> **supported-languages** : Languages supported by the module cf. [Translating module](#translating) 

> **iconURL** : URL of the icon displayed in the modules page of the setting
> panel, it can be leaved blank

> **status-setting** : Contains a key and a default **boolean** value
> corresponding to the setting that will manage the module's activation state

> **settings** : Contains multiple settings that will be automatically loaded by
> the module manager in the module

All keys in the module.son file are mandatory, though the setting key must be 
present, its value can be leaved empty.


#### **Optional files and folders**
#### **/assets**
The assets folder contains all of the modules used files such as icons, images,
sounds, musics, and so on...

> All of the files present in the assets folder will be copied at compilation 
> into its corresponding folder as follows

This path : <br>
` src/modules/dummyModule/assets/dummyAsset.png ` <br>
Will become :  <br>
` dist/modules/dummyModule/assets/dummyAsset.png `

In consequences if you want to use the module's assets, be sure to reference the
**output path** and **not** the **input path** when **referencing assets**.

### Registering
Once the module is created, it is necessary to register it in the modules.json file
of the modules/ directory. To do so, just add the module folder in the file as
following : 

#### modules.json
```json
[
    "moduleFolder1",
    "moduleFolder2"
]
```
NB: The key must be exactly the same as the module's folder(case sensitive)

### Translating
#### **modules.json**
When adding translations for a module, the following line must be added in the modules.json file
```json 
"supported-languages": []
```
Inside the square brackets, you can enter the langauages that the module
supports, here for instance we will add the english and vietnamese support :
```json 
"supported-languages": ["en", "fr"]
```
It can also be set to "inherit" which will corrsepond to all languages supported
by the extensions, see [Languages config.ts](https://github.com/NoCymer/nexxt-tabs/wiki/Languages#File%20config.ts).
```json 
"supported-languages": "inherit"
```

Lets refocus on adding the english and vietnamese support, given the following :
```json 
"supported-languages": ["en", "fr"]
```

As soon as you add this line, you must add the following folders to the module's
structure and in all translations.json, adding an opening and closing
curly brackets minimum or you will get an error.
```
ModuleName
|-- locales                     *
|   |-- en                      *
|       |-- translations.json   *
|   |-- vi                      *
|       |-- translations.json   *
|-- ModuleName.tsx 
|-- module.json    
|-- index.ts       
```
**locales/en/translations.json** and **locales/vi/translations.json** :
```json 
{}
```
Thoses translations.json files works by key value pairs, if for instance you
want to add translation for the word "apple" you would do as follows : <br>
**locales/en/translations.json**:
```json 
{
    "apple" : "apple"
}
```
**locales/vi/translations.json** :
```json 
{
    "apple" : "quả táo"
}
```
To reference the translation in the code you would do exactly as explained in the
[Languages Page](https://github.com/NoCymer/nexxt-tabs/wiki/Languages#Getting%20translation).


The translation of the title and description of the module is tried automatically
on creation of the instance of the module, by passing the value of the title in
the i18n translator.

So if for instance you have your module.json as follows
```json
{
    "name" : "dummyModule",                            
    "title": "dummy-module-title",
    "desc": "dummy-module-desc",
    "supported-languages": ["en"],
    "iconURL": "app-ressources/dummyModule.svg",
    "status-setting" : {
        "key": "dummy-module-activated-boolean",
        "defaultValue": true
    },
    "settings" : {
        "dummySetting" : {
            "defaultValue": "dummyValue"
        },
        "dummySetting1" : {
            "defaultValue": "dummyValue1"
        }
    }
}
```

And got your locales/en/translation.json file setup as follows

```json 
{
    "dummy-module-title" : "Dummy Module Title !",
    "dummy-module-desc" : "Dummy Module Description !"
}
```

Then at runtime your module will have the title set to "Dummy Module Title !"
and its description set to "Dummy Module Description !".