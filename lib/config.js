const _ = require("lodash");

class Config {
  #schema;
  constructor(schema, obj) {
    this.#schema = schema;

    _.assign(this, schema.getDefaults());
    this.loadEnv();
    _.merge(this, obj);
  }
  loadEnv() {
    this.#schema.enumerate(
      function(key, def) {
        let { env, format } = def;
        for (var i = 0; i < env.length; i++) {
          let varName = env[i];
          if (process.env.hasOwnProperty(varName)) {
            let val = process.env[varName];
            if (format) {
              val = format.coerce(val);
            }
            _.setWith(this, key, val, Object);
            return;
          }
        }
      }.bind(this)
    );
  }
  get(path) {
    return _.get(this, path);
  }
  validate() {
    this.#schema.validate(this);
  }
}

module.exports = Config;
