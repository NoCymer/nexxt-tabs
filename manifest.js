const fs = require('fs'); 
const archiver = require('archiver');

function zipDir(sourceDir, outPath) {
  const ar = archiver('zip', { zlib: { level: 9 }});
  const writeStream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    ar
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(writeStream)
    ;

    writeStream.on('close', () => resolve());
    ar.finalize();
  });
}

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
        switch (args[2].toLowerCase()) {
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
    if (fs.existsSync("./dist/dist.zip"))
      fs.rmSync("./dist/dist.zip");

    if (fs.existsSync("./dist.zip"))
      fs.rmSync("./dist.zip");

    zipDir("./dist", "./dist.zip").then(() => {
      fs.copyFileSync("./dist.zip", "./dist/dist.zip");

      if (fs.existsSync("./dist.zip"))
        fs.rmSync("./dist.zip");

    });
}

main();