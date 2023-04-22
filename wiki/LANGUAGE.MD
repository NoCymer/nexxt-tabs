This page explains how the translation works in the extension and how to add languages.

## Getting translation
To get a translation fragment we first need to import i18n

```ts
import { useTranslation } from "react-i18next";
```

Then we need to extract the translation module from i18n's useTranslation

```ts
const { t } = useTranslation();
```

And finally we just need to use the t function to get the translation of a given
label which corresponds to the key in the translation.json file.

```ts
t("view");
```
Here we're searching for the translation corresponding to the *"view"* key in the
translation.json file.


## Adding Language
To add a new language you must create a new folder in the @Public/i18n/locales folder
named with the language initials then add a new translation.json file in it.

### File translation.json

In the translation.json file 
```json
{
  "appName": "NEXXT TABS",
}
```
On the left we have the label of the translation fragment and on the right we
have the actual translation.

### File config.ts

To finish adding the language, we finally need to add it in the
@Public/i18n/config.ts file 

*For instance, here we will add the vitenamese language*

First adding into the ressouces 

```ts
resources: {
    vi: {
      translations: require('./locales/vi/translations.json')
    }
}
```
Then adding it into the languages array variable of i18n

```ts
i18n.languages = ['en', 'es', 'fr', 'vi'];
```