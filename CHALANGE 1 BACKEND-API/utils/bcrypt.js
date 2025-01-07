const bcrypt = require("bcrypt");

const defaultSalt = bcrypt.genSaltSync(10);

const hashText = (text, salt = defaultSalt) => bcrypt.hashSync(text, salt);

module.exports = { hashText };
