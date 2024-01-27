const path = require("path");
const fs = require("fs");

class MiniCssExtractCleanupPlugin {
    constructor(listOfFilesToRemove) {
        this.listOfFilesToRemove = listOfFilesToRemove;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap(
            "MiniCssExtractCleanupPlugin",
            (compilation) => {
                this.listOfFilesToRemove.forEach((file) => {
                    const filePath = path.join(compilation.outputOptions.path, file);

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
        );
    }
}

module.exports = MiniCssExtractCleanupPlugin;
