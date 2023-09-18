import json

languages = ["en", "es", "fr", "vi", "it"]
jasons = {}

new_key = input("What translation key you want to add : ")


for language in languages:
    with open(f"public/i18n/locales/{language}/translations.json", 'r') as file:
        jason = json.load(file)
        jason[new_key] = input(f"Translation for {new_key} in {language} : ")
        jasons[language] = jason
    with open(f"public/i18n/locales/{language}/translations.json", 'w') as file:
        json.dump(jasons[language], file)