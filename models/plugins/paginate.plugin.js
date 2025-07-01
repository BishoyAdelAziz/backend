// models/plugins/paginate.plugin.js
const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    const { sortBy, limit = 10, page = 1 } = options;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter);

    if (sortBy) {
      const sorting = {};
      const [field, order] = sortBy.split(":");
      sorting[field] = order === "desc" ? -1 : 1;
      docsPromise = docsPromise.sort(sorting);
    }

    if (limit && page) {
      const skip = (page - 1) * limit;
      docsPromise = docsPromise.skip(skip).limit(limit);
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [total, results] = values;
      const totalPages = Math.ceil(total / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        total,
      };
      return result;
    });
  };
};

module.exports = paginate;
