// Custom  validator to check for duplicates in the database
const validateUniqueField = (model, fieldName) => {
  return async (value, helpers) => {
    if (value) {
      const existingRecord = await model.findOne({
        where: { [fieldName]: value },
      });

      if (existingRecord) {
        return helpers.message(`${fieldName} is already in use`);
      }
      return value;
    }
  };
};

module.exports = { validateUniqueField };
