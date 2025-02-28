// Requiring ObjectId from mongoose npm package
const ObjectId = require("mongoose").Types.ObjectId;

// Validator function
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

module.exports = isValidObjectId;
