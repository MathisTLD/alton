const Alton = require("./lib");

Object.assign(process.env, {
  PASS: "PASS1",
  SECRET: "PASS2",
  MOTD: "Hi from the env"
});

let schema = new Alton({
  port: {
    default: 7474,
    format: "number"
  },
  pass: {
    default: null,
    format: "required",
    env: ["PASS", "SECRET"]
  },
  nested: {
    callback: {
      default: function() {
        return "blah";
      },
      format: "function"
    },
    motd: {
      default: "Hi",
      env: "MOTD"
    }
  }
});

let config = schema.load({
  port: 2020,
  nested: {
    callback() {
      return "bluh";
    },
    motd: "overriding env"
  }
});

config.validate();

if (
  config.get("port") !== 2020 ||
  config.get("pass") !== "PASS1" ||
  config.get("nested.callback")() !== "bluh" ||
  config.get("nested.motd") !== "overriding env"
)
  throw new Error("test failed");
