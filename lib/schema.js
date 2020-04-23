const _ = require("lodash");
const Format = require("./format");
const Config = require("./config");

function traverse(obj, path, callback, hasChild = val => true) {
  let node;
  if (!path) {
    node = obj;
  } else {
    node = _.get(obj, path);
  }
  for (let prop in node) {
    let child = node[prop];
    let childPath = path ? `${path}.${prop}` : prop;
    if (child && typeof child === "object" && hasChild(child)) {
      traverse(obj, childPath, callback, hasChild);
    } else {
      callback(childPath, child);
    }
  }
}

class Schema {
  constructor(definition) {
    this.definition = definition;
    this.keys = [];

    // get keys
    traverse(
      this.definition,
      "",
      function(path) {
        this.keys.push(path);
      }.bind(this),
      node => !node.hasOwnProperty("default")
    );

    this.normalize();
  }
  enumerate(callback) {
    this.keys.forEach(function(key) {
      let val = _.get(this.definition, key);
      callback(key, val);
    }, this);
  }
  normalize() {
    let definition = this.definition;
    this.enumerate((key, val) => {
      // normalize env declaration
      let env = [];
      if (typeof val.env === "string") env.push(val.env);
      else if (
        Array.isArray(val.env) &&
        val.env.every(varName => typeof varName === "string")
      ) {
        env = val.env;
      }
      val.env = env;

      // inject format
      let format;
      switch (typeof val.format) {
        case "object":
          format = new Format(val.format);
          break;
        case "string":
          format = Format.get(val.format);
          break;
        default:
          format = Format.get("any");
      }
      val.format = format;
    });
  }
  getDefaults() {
    let defaults = {};
    this.enumerate((key, val) => _.setWith(defaults, key, val.default, Object));
    return defaults;
  }
  validate(config) {
    let definition = this.definition;
    this.enumerate((key, def) => {
      let format = def.format;
      let val = config.get(key);

      try {
        format.validate(val, key);
      } catch (e) {
        throw new Error(`invalid option at ${key} : ${e}`);
      }
    });
  }
  load(obj) {
    return new Config(this, obj);
  }
  static registerFormat(name, definition) {
    Format.register(name, definition);
  }
}

module.exports = Schema;
