module.exports = {
  any: {
    validate() {
      return;
    }
  },
  required: {
    validate(val) {
      if (val === undefined || val === null)
        throw new Error(`option is required, expected a value got ${val}`);
    }
  },
  number: {
    validate: val => Number.prototype.toString.call(val) == val.toString(),
    coerce: val => Number(val)
  },
  boolean: {
    validate: val => Boolean.prototype.toString.call(val) == val.toString(),
    coerce: function(string) {
      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
          return true;
        case "false":
        case "no":
        case "0":
        case null:
          return false;
        default:
          return Boolean(string);
      }
    }
  },
  string: {
    validate: val => String.prototype.toString.call(val) == val.toString()
  },
  function: {
    validate: val => Function.prototype.toString.call(val) == val.toString(),
    coerce: val => val.parseFunction()
  },
  object: {
    validate: val => Object.prototype.toString.call(val) == val.toString(),
    coerce: val => JSON.parse(val)
  },
  array: {
    validate: val => Array.prototype.toString.call(val) == val.toString(),
    coerce: val => JSON.parse(val)
  },
  regexp: {
    validate: val => RegExp.prototype.toString.call(val) == val.toString(),
    coerce: val => RegExp(val)
  }
};
