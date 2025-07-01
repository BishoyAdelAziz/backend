const toJSON = (schema) => {
  schema.options.toJSON = {
    transform(doc, ret) {
      // Remove version and internal fields
      delete ret.__v;
      delete ret._id;

      // Convert _id to id
      ret.id = doc._id.toString();

      // Remove any private paths
      schema.eachPath((path, type) => {
        if (path.startsWith("_") || type.options.private) {
          delete ret[path];
        }
      });
    },
    virtuals: true,
  };
};

module.exports = toJSON;
