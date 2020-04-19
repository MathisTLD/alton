class Format {
  constructor(definition) {
    this.definition = definition;
    this.name = definition ? definition.name : undefined;
  }
  validate(value) {
    if (this.definition && this.definition.validate)
      return this.definition.validate(value);
    return true;
  }
  coerce(value) {
    if (this.definition && this.definition.coerce)
      return this.definition.coerce(value);
    return value;
  }
  static get(name) {
    let format = Format.formats[name];
    if (!format) throw new Error(`Unknown format ${name}`);
    else return format;
  }
  static register(name, definition) {
    definition.name = name;
    let format = new Format(definition);
    Format.formats[name] = format;
  }
  static formats = {};
}

const definitions = require("./formats");
for (var name in definitions) {
  if (definitions.hasOwnProperty(name)) {
    let definition = definitions[name];
    Format.register(name, definition);
  }
}

module.exports = Format;
