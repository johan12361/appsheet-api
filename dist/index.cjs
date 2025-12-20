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
  AppsheetClient: () => AppsheetClient
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
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function makeRequest(credentials, clientConfig, config, table, action, properties = {}, rows) {
  const apiUrl = `${clientConfig.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = {
    Action: action,
    Properties: {
      Locale: clientConfig.locale,
      Timezone: clientConfig.timezone,
      UserSettings: clientConfig.userSettings,
      ...properties
    },
    Rows: !Array.isArray(rows) ? [rows] : rows
  };
  const maxRetries = config.maxRetriesOnRateLimit ?? 3;
  const retryDelay = config.retryDelay ?? 1e3;
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const [error, response] = await catchError_default(import_axios.default.post(apiUrl, body, { headers }));
    if (error) {
      if (import_axios.default.isAxiosError(error) && error.response?.status === 429) {
        lastError = error;
        if (attempt < maxRetries) {
          await sleep(retryDelay * (attempt + 1));
          continue;
        }
      }
      throw error;
    }
    if (!response?.data) {
      throw new Error("AppSheet response does not contain data");
    }
    if (response.data.Rows && Array.isArray(response.data.Rows)) {
      return response.data.Rows;
    }
    const toArray = Array.isArray(response.data) ? response.data : [response.data];
    return toArray;
  }
  throw lastError;
}

// src/schema/buildValues/buildString.ts
function buildString(_valueSchema, value) {
  return value;
}

// src/schema/buildValues/buildBool.ts
var TRUE_VALUES = ["true", "1", "yes", "on", "y"];
function buildBool(_valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  return TRUE_VALUES.includes(value.toLowerCase());
}

// src/schema/buildValues/buildNumber.ts
function buildNumber(_valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  const numValue = Number(value);
  return isNaN(numValue) ? void 0 : numValue;
}

// src/schema/buildValues/buildInteger.ts
function buildInteger(_valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  const intValue = parseInt(value, 10);
  return isNaN(intValue) ? void 0 : intValue;
}

// src/schema/buildValues/buildDate.ts
var import_luxon = require("luxon");
var DATE_FORMATS = ["MM/dd/yyyy HH:mm:ss", "MM/dd/yyyy HH:mm", "MM/dd/yyyy"];
function parseDate(input, timezone) {
  for (const format of DATE_FORMATS) {
    const dt = import_luxon.DateTime.fromFormat(input, format, { zone: timezone });
    if (dt.isValid) {
      return dt;
    }
  }
  return null;
}
function buildDate(_valueSchema, value, config) {
  if (value === void 0) {
    return void 0;
  }
  const timezone = config.timezone ?? "UTC";
  const dt = parseDate(value, timezone);
  return dt?.toJSDate();
}

// src/schema/buildValues/buildArray.ts
var HANDLED = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  date: buildDate
};
function processItem(item, valueSchema, config) {
  const buildValueFunction = HANDLED[valueSchema.itemType];
  if (buildValueFunction) {
    return buildValueFunction(valueSchema, item.trim(), config);
  }
  return void 0;
}
function buildArray(valueSchema, value, config) {
  if (value === void 0) {
    return Array.isArray(valueSchema.default) ? valueSchema.default : [];
  }
  const items = value.split(" , ").map((item) => processItem(item, valueSchema, config)).filter((v) => v !== void 0);
  return items;
}

// src/schema/buildData.ts
var BASIC_TYPES = ["string", "number", "integer", "boolean", "array", "date"];
var BUILD_VALUE_FUNCTIONS = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  boolean: buildBool,
  array: buildArray,
  date: buildDate
};
function buildData(config, item, schema) {
  const data = {};
  for (const [key, value] of Object.entries(schema)) {
    const itemKey = value.key ?? key;
    if (BASIC_TYPES.includes(value.type)) {
      const itemValue = item[itemKey];
      if (itemValue === void 0) {
        continue;
      }
      const rawValue = getStringValue(itemValue);
      const buildValueFunction = BUILD_VALUE_FUNCTIONS[value.type];
      if (buildValueFunction) {
        data[key] = buildValueFunction(value, rawValue, config);
      } else {
        data[key] = rawValue;
      }
    } else if (value.type === "object" && value.properties && Object.keys(value.properties).length > 0) {
      const subData = buildData(config, item, value.properties);
      data[key] = subData;
    }
  }
  return data;
}
function getStringValue(value) {
  if (typeof value === "string" && value.includes("Url") && value.includes("LinkText")) {
    const jsonValue = JSON.parse(value);
    value = jsonValue.Url;
  }
  if (typeof value === "string") {
    if (value.trim() === "") {
      return void 0;
    }
    return value;
  }
  if (value === void 0 || value === null) {
    return void 0;
  }
  return String(value);
}

// src/schema/methods/findById.ts
async function findById(credentials, clientConfig, schemaId, config, dataSchema, id) {
  const idKey = Object.keys(dataSchema).find((key2) => dataSchema[key2].primary === true);
  if (!idKey) {
    throw new Error("No ID key defined in data schema.");
  }
  const key = dataSchema[idKey].key || idKey;
  const row = { [key]: id };
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Find", {}, row);
  if (response.length === 0) {
    return void 0;
  }
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}

// src/schema/methods/find.ts
async function find(credentials, clientConfig, schemaId, config, dataSchema, properties = {}, rows = []) {
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Find", properties, rows);
  if (config.returnRawData) {
    return response;
  }
  const result = response.map((item) => buildData(config, item, dataSchema));
  return result;
}

// src/schema/revertValues/revertString.ts
function revertString(valueSchema, value) {
  if (value !== void 0) {
    return String(value);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  return String(defaultValue);
}

// src/schema/revertValues/revertBool.ts
function revertBool(valueSchema, value) {
  if (value !== void 0) {
    return Boolean(value);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  return Boolean(defaultValue);
}

// src/schema/revertValues/revertInteger.ts
function toInteger(val) {
  const result = parseInt(String(val), 10);
  return isNaN(result) ? void 0 : result;
}
function revertInteger(valueSchema, value) {
  if (value !== void 0) {
    return toInteger(value);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  return toInteger(defaultValue);
}

// src/schema/revertValues/revertNumber.ts
function toNumber(val) {
  const result = Number(val);
  return isNaN(result) ? void 0 : result;
}
function revertNumber(valueSchema, value) {
  if (value !== void 0) {
    return toNumber(value);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  return toNumber(defaultValue);
}

// src/schema/revertValues/revertDate.ts
function buildDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function convertToDateString(val) {
  if (val instanceof Date) {
    return buildDateString(val);
  }
  if (typeof val === "string") {
    return val;
  }
  return void 0;
}
function revertDate(valueSchema, value) {
  if (value !== void 0) {
    return convertToDateString(value);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  return convertToDateString(defaultValue);
}

// src/schema/revertValues/revertArray.ts
var HANDLED2 = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  date: revertDate
};
function processArrayToString(arr, valueSchema) {
  const revertValueFunction = HANDLED2[valueSchema.itemType];
  const items = arr.map((item) => {
    if (revertValueFunction) {
      const revertedValue = revertValueFunction(valueSchema, item);
      if (revertedValue !== void 0) {
        return String(revertedValue);
      }
    }
    return String(item);
  }).filter((v) => v !== void 0 && v !== "undefined");
  return items.join(" , ");
}
function revertArray(valueSchema, value) {
  if (value !== void 0 && Array.isArray(value)) {
    return processArrayToString(value, valueSchema);
  }
  if (valueSchema.default === void 0) {
    return void 0;
  }
  const defaultValue = typeof valueSchema.default === "function" ? valueSchema.default() : valueSchema.default;
  if (Array.isArray(defaultValue)) {
    return defaultValue.join(" , ");
  }
  return void 0;
}

// src/schema/revertData.ts
var BASIC_TYPES2 = ["string", "number", "integer", "boolean", "array", "date"];
var REVERT_VALUE_FUNCTIONS = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  boolean: revertBool,
  array: revertArray,
  date: revertDate
};
function revertData(config, data, schema, setDefault = true) {
  const row = {};
  for (const [key, value] of Object.entries(schema)) {
    const itemKey = value.key ?? key;
    const fieldValue = data[key];
    const hasValue = fieldValue !== void 0;
    const hasDefault = value.default !== void 0;
    if (!hasValue && !(setDefault && hasDefault)) {
      continue;
    }
    if (BASIC_TYPES2.includes(value.type)) {
      const revertValueFunction = REVERT_VALUE_FUNCTIONS[value.type];
      if (revertValueFunction) {
        const revertedValue = revertValueFunction(value, fieldValue);
        if (revertedValue !== void 0) {
          row[itemKey] = revertedValue;
        }
      } else if (hasValue) {
        row[itemKey] = fieldValue;
      }
    } else if (value.type === "object" && value.properties && Object.keys(value.properties).length > 0) {
      if (!hasValue) {
        continue;
      }
      const subData = revertData(config, fieldValue, value.properties, setDefault);
      if (Object.keys(subData).length > 0) {
        Object.assign(row, subData);
      }
    }
  }
  return row;
}

// src/schema/methods/create.ts
async function create(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  let row;
  if (config.sendRawData) {
    row = data;
  } else {
    row = revertData(config, data, dataSchema);
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Add", properties, row);
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}

// src/schema/methods/createMany.ts
async function createMany(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  let rows;
  if (config.sendRawData) {
    rows = data;
  } else {
    rows = data.map((item) => revertData(config, item, dataSchema));
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Add", properties, rows);
  if (config.returnRawData) {
    return response;
  }
  const result = response.map((item) => buildData(config, item, dataSchema));
  return result;
}

// src/schema/methods/update.ts
async function update(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true);
  if (!primaryKeyEntry) {
    throw new Error("No primary key found in schema (property with primary: true)");
  }
  const [primaryKeyName] = primaryKeyEntry;
  if (!(primaryKeyName in data)) {
    throw new Error(`Primary key '${primaryKeyName}' does not exist in the provided object`);
  }
  let row;
  if (config.sendRawData) {
    row = data;
  } else {
    row = revertData(config, data, dataSchema, false);
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Edit", properties, row);
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}

// src/schema/methods/updateMany.ts
async function updateMany(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true);
  if (!primaryKeyEntry) {
    throw new Error("No primary key found in schema (property with primary: true)");
  }
  const [primaryKeyName] = primaryKeyEntry;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!(primaryKeyName in item)) {
      throw new Error(`Primary key '${primaryKeyName}' does not exist in object at index ${i}`);
    }
  }
  let rows;
  if (config.sendRawData) {
    rows = data;
  } else {
    rows = data.map((item) => revertData(config, item, dataSchema, false));
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Edit", properties, rows);
  if (config.returnRawData) {
    return response;
  }
  const result = response.map((item) => buildData(config, item, dataSchema));
  return result;
}

// src/schema/methods/delete.ts
async function deleteRecord(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true);
  if (!primaryKeyEntry) {
    throw new Error("No primary key found in schema (property with primary: true)");
  }
  const [primaryKeyName] = primaryKeyEntry;
  if (!(primaryKeyName in data)) {
    throw new Error(`Primary key '${primaryKeyName}' does not exist in the provided object`);
  }
  let row;
  if (config.sendRawData) {
    row = data;
  } else {
    row = revertData(config, data, dataSchema, false);
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Delete", properties, row);
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}

// src/schema/methods/deleteMany.ts
async function deleteMany(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true);
  if (!primaryKeyEntry) {
    throw new Error("No primary key found in schema (property with primary: true)");
  }
  const [primaryKeyName] = primaryKeyEntry;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!(primaryKeyName in item)) {
      throw new Error(`Primary key '${primaryKeyName}' does not exist in object at index ${i}`);
    }
  }
  let rows;
  if (config.sendRawData) {
    rows = data;
  } else {
    rows = data.map((item) => revertData(config, item, dataSchema, false));
  }
  const response = await makeRequest(credentials, clientConfig, config, schemaId, "Delete", properties, rows);
  if (config.returnRawData) {
    return response;
  }
  const result = response.map((item) => buildData(config, item, dataSchema));
  return result;
}

// src/schema/schema.ts
var Schema = class {
  constructor(credentials, config, clientConfig, schemaId, dataSchema) {
    this.credentials = credentials;
    this.config = config;
    this.clientConfig = clientConfig;
    this.schemaId = schemaId;
    this.dataSchema = dataSchema;
  }
  async findById(id) {
    if (!id) {
      throw new Error("ID is required to find an item by ID.");
    }
    return findById(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, id);
  }
  async find(properties = {}, rows = []) {
    return find(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, properties, rows);
  }
  async create(data, properties = {}) {
    return create(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties);
  }
  async createMany(dataArray, properties = {}) {
    return createMany(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    );
  }
  async update(data, properties = {}) {
    return update(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties);
  }
  async updateMany(dataArray, properties = {}) {
    return updateMany(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    );
  }
  async delete(data, properties = {}) {
    return deleteRecord(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      data,
      properties
    );
  }
  async deleteMany(dataArray, properties = {}) {
    return deleteMany(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    );
  }
};

// src/client/client.ts
var defaultSystemContext = {
  config: {
    timezone: "UTC",
    returnRawData: false,
    sendRawData: false,
    maxRetriesOnRateLimit: 3,
    retryDelay: 1e3
  },
  client: {
    url: "https://www.appsheet.com",
    locale: "en-GB",
    timezone: process.env.TZ || "UTC",
    userSettings: {}
  }
};
var AppsheetClient = class {
  constructor(credentials, systemContext = {}) {
    this.credentials = credentials;
    this.systemContext = {
      config: {
        ...defaultSystemContext.config,
        ...systemContext?.config
      },
      client: {
        ...defaultSystemContext.client,
        ...systemContext?.client
      }
    };
  }
  createSchema(schemaId, data) {
    return new Schema(this.credentials, this.systemContext.config, this.systemContext.client, schemaId, data);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppsheetClient
});
