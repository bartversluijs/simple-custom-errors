"use strict"

module.exports = (error) => {
  if(error instanceof Error) {

    let response = {
      error: error.code,
      description: error.message
    }

    if(error.hasOwnProperty("details") && Object.keys(error.details).length > 0) { response.details = error.details; }

    return response;

  } else {
    return error; // Just return the error if the instance is not an error
  }
}
