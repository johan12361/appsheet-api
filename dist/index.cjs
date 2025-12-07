"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Client: () => Client
});
module.exports = __toCommonJS(index_exports);

// src/request/request.ts
var import_axios = __toESM(require("axios"), 1);

// src/utils/catchError.ts
async function catchError(Promise2) {
  try {
    const data = await Promise2;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}
var catchError_default = catchError;

// src/request/request.ts
async function makeRequest(config, table, properties = {}, action, rows, credentials) {
  const apiUrl = `${config.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = {
    Action: action,
    Properties: {
      Locale: config.locale,
      Timezone: config.timezone,
      ...properties
    },
    Rows: !Array.isArray(rows) ? [rows] : rows
  };
  const [error, response] = await catchError_default(import_axios.default.post(apiUrl, body, { headers }));
  if (error) {
    throw error;
  }
  return response.data;
}

// src/schema/schema.ts
var Schema = class {
  constructor(credentials, config, schemaId, dataSchema) {
    this.credentials = credentials;
    this.config = config;
    this.schemaId = schemaId;
    this.dataSchema = dataSchema;
  }
  //ss get all items
  async getAll() {
    const response = await makeRequest(this.config, this.schemaId, {}, "Find", [], this.credentials);
    return response;
  }
};

// src/client/client.ts
var defaultConfig = {
  url: "https://www.appsheet.com",
  locale: "en-GB",
  timezone: "UTC"
};
var Client = class {
  constructor(credentials, config = {}) {
    this.credentials = credentials;
    this.config = {
      ...defaultConfig,
      ...config
    };
  }
  //ss create schema
  createSchema(schemaId, data) {
    return new Schema(this.credentials, this.config, schemaId, data);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client
});
