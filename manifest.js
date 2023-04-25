const fs = require('fs'); 

const args = process.argv;

const ff_manifest = {
    "chrome_settings_overrides" : {
      "homepage": "index.html"
    },
    "browser_specific_settings": {
      "gecko": {
        "id": "{8f518d75-6943-4c0e-9f28-224d4712cc03}",
        "strict_min_version": "42.0"
      }
    }
}

const main = () => {
    if(args.length < 3) args[2] = ""
    fs.readFile("./public/manifest.json", 'utf8', (err, manifest) => {
        manifest = JSON.parse(manifest)
        switch (args[2]) {
            case "firefox":
                fs.writeFileSync("./dist/manifest.json", JSON.stringify({...manifest, ...ff_manifest}));
                break;
            case "chrome":
                fs.writeFileSync("./dist/manifest.json", JSON.stringify(manifest));
                break;
            default:
                fs.writeFileSync("./dist/manifest.json", JSON.stringify(manifest));
                break;
        }
    }); 
}

main();