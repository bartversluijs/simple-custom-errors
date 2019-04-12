const placeholderRegex = new RegExp(/{{(.*?)}}/g);

module.exports = (error, errorObject) => {
  let findError = errorObject.find(e => e.code === error.code);
  if(typeof findError !== typeof undefined && findError !== null) {

    if(findError.hasOwnProperty("sentry")) { error.sentry = findError.sentry; }

    if(findError.hasOwnProperty("details")) {

      findError.details.forEach(key => {
        if(typeof key === "string") {
          error.details[key] = null;
          if(error._details.hasOwnProperty(key)) {
            error.details[key] = error._details[key];
          }
        }
      })

    }

    if(findError.hasOwnProperty("description")) {
      error.message = findError.description;

      let regexMatch;
      do {
        regexMatch = placeholderRegex.exec(error.message);
        if(regexMatch) {
          if(error.details.hasOwnProperty(regexMatch[1])) {
            error.message = error.message.replace(new RegExp(regexMatch[0], "g"), error.details[regexMatch[1]]);
          }
        }
      } while (regexMatch);

    }
  }
}
