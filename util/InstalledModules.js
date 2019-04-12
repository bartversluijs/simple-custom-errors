const path = require("path");
const fs = require("fs");

let packagePath = path.resolve(process.cwd(), "package.json");
let installedModules = [];

if(fs.existsSync(packagePath)) {
  fs.readFile(packagePath, "utf8", (err, file) => {
    if(err) {
      console.error(err);
    } else {

      let modules = null;
      try {
        modules = JSON.parse(file);
        modules = modules.dependencies;
      } catch(e) {
        console.error(e);
      }

      if(modules !== null) {
        Object.keys(modules).forEach(key => {
          installedModules.push(key);
        })
      }

    }
  })
} else {
  console.warn("CustomErrors WARNING: Package.json file not found");
}

module.exports = installedModules;
