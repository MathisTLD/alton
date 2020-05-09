# Alton

## Install

```bash
npm install alton
```

## Schema

schema are multi-level structure defined by an object as following

```js
const Alton = require("alton");

const mySchema = new Alton({
  env: {
    default: "development", // !! required !! (set this as null or smth if you don't want to provide a default value)
    format: "string", // see formats below
    env: "NODE_ENV", // any env var to load for this options
    // env could also bee and array in this case leftmost is tried first
    // but if it's not found the one at its right is tried next and over and over ...
    // env : ["NODE_ENV","ENV"]
    doc: "Set node env" // currently not doing anything with that but this will come one day on another
  },
  netsted: {
    // alton is multi-level it will detect as an options anything that has a "default prop"
    netstedA: {
      default: true,
      format: "boolean"
    },
    netstedB: {
      default: 74
      // if omitted, format is set as "any"
    }
  }
});
```

## Format

formats allows you to check an option validity and add support for coercion

```js
Alton.registerFormat("port", {
  // validate is a method that is called in order to ensure that a value matches a format
  // this method must throw an error if the value is incorrect
  validate(val) {
    if (Number.prototype.toString.call(val) !== val.toString())
      throw new Error("port must be a number");
    if (Math.floor(val) !== val)
      throw new Error("port number must be an integer");
    if (!(0 <= val && val <= 65535))
      throw new Error(`${val} is not a valid port number`);
  },
  coerce(val) {
    // val comes from an env var so it's a string here let's convert it to a number
    return Number(val);
  }
});
```

You can also register anonymous formats directly in you schema definition

```js
let mySchema = new Alton({
  port: {
    default: 7474,
    format: {
      validate(val) {
        // validation stuff here...
      },
      coerce(val) {
        return Number(val);
      }
    }
  }
});
```

> :warning: **validate method must be synchronous for now**
