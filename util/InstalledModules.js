const path = require("path");
const fs = require("fs");

let packagePath = path.resolve(process.cwd(), "package.json");
let installedModules = [];

if(fs.existsSync(packagePath)) {
  fs.readFile(packagePath, "utf8", (err, file) => {
    if(err) {
      console.warn("CustomErrors WARNING: Unable to read package.json file");

      if(process.env.NODE_ENV !== "production") { console.error(err); }
    } else {

      let modules = null;
      try {
        modules = JSON.parse(file);
        modules = modules.dependencies;
      } catch(e) {
        console.warn("CustomErrors WARNING: Unable to parse package.json file to JSON");
      }

      if(modules !== null && typeof modules !== typeof undefined) {
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
