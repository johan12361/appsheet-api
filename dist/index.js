// src/request/request.ts
import axios from "axios";

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
async function makeRequest(credentials, clientConfig, table, action, properties = {}, rows) {
  const apiUrl = `${clientConfig.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`;
  const headers = {
    "Content-Type": "application/json"
  };
  const body = {
    Action: action,
    Properties: {
      Locale: clientConfig.locale,
      Timezone: clientConfig.timezone,
      ...properties
    },
    Rows: !Array.isArray(rows) ? [rows] : rows
  };
  const [error, response] = await catchError_default(axios.post(apiUrl, body, { headers }));
  if (error) {
    throw error;
  }
  if (!response?.data) {
    throw new Error("La respuesta de AppSheet no contiene datos");
  }
  if (response.data.Rows && Array.isArray(response.data.Rows)) {
    return response.data.Rows;
  }
  const toArray = Array.isArray(response.data) ? response.data : [response.data];
  return toArray;
}

// src/schema/buildValues/buildString.ts
function buildString(valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  return value;
}

// src/schema/buildValues/buildBool.ts
var trueValues = ["true", "1", "yes", "on", "y"];
function buildBool(valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  const cleanValue = value.toLowerCase();
  return trueValues.includes(cleanValue);
}

// src/schema/buildValues/buildNumber.ts
function buildNumber(valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return void 0;
  }
  return numValue;
}

// src/schema/buildValues/buildInteger.ts
function buildInteger(valueSchema, value) {
  if (value === void 0) {
    return void 0;
  }
  const intValue = parseInt(value, 10);
  if (isNaN(intValue)) {
    return void 0;
  }
  return intValue;
}

// src/schema/buildValues/buildDate.ts
import { DateTime } from "luxon";
function buildDate(valueSchema, value, config) {
  if (value === void 0) {
    return void 0;
  }
  const tz = config.timezone || "UTC";
  const dt = parseDateWithTZ(value, tz);
  if (dt) {
    const jsDate = dt.toJSDate();
    return jsDate;
  }
  return void 0;
}
function parseDateWithTZ(input, tz) {
  const formats = [
    "MM/dd/yyyy HH:mm:ss",
    "MM/dd/yyyy HH:mm",
    "MM/dd/yyyy"
    // sin hora
  ];
  for (const fmt of formats) {
    const dt = DateTime.fromFormat(input, fmt, { zone: tz });
    if (dt.isValid) {
      return dt;
    }
  }
  return null;
}

// src/schema/buildValues/buildArray.ts
var HANDLED = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  date: buildDate
};
function buildArray(valueSchema, value, config) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      return Array.isArray(valueSchema.default) ? valueSchema.default : [];
    }
    return [];
  }
  const items = value.split(" , ").map((item) => {
    const cleanItem = item.trim();
    const buildValueFunction = HANDLED[valueSchema.itemType];
    if (buildValueFunction) {
      const builtValue = buildValueFunction(valueSchema, cleanItem, config);
      if (builtValue !== void 0) {
        return builtValue;
      }
    }
    return void 0;
  }).filter((v) => v !== void 0);
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
    let itemKey = key;
    if (value.key) {
      itemKey = value.key;
    }
    if (BASIC_TYPES.includes(value.type)) {
      if (item[itemKey] === void 0) {
        continue;
      }
      const rawValue = getStringValue(item[itemKey]);
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
  const response = await makeRequest(credentials, clientConfig, schemaId, "Find", {}, row);
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
  const response = await makeRequest(credentials, clientConfig, schemaId, "Find", properties, rows);
  if (config.returnRawData) {
    return response;
  }
  const result = response.map((item) => buildData(config, item, dataSchema));
  return result;
}

// src/schema/revertValues/revertString.ts
function revertString(valueSchema, value) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      return String(valueSchema.default);
    }
    return void 0;
  }
  return String(value);
}

// src/schema/revertValues/revertBool.ts
function revertBool(valueSchema, value) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      return Boolean(valueSchema.default);
    }
    return void 0;
  }
  return Boolean(value);
}

// src/schema/revertValues/revertInteger.ts
function revertInteger(valueSchema, value) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      const revert = parseInt(String(valueSchema.default), 10);
      return isNaN(revert) ? void 0 : revert;
    }
    return void 0;
  }
  const result = parseInt(String(value), 10);
  return isNaN(result) ? void 0 : result;
}

// src/schema/revertValues/revertNumber.ts
function revertNumber(valueSchema, value) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      const result2 = Number(valueSchema.default);
      return isNaN(result2) ? void 0 : result2;
    }
    return void 0;
  }
  const result = Number(value);
  return isNaN(result) ? void 0 : result;
}

// src/schema/revertValues/revertDate.ts
function revertDate(valueSchema, value) {
  if (value === void 0) {
    if (valueSchema.default !== void 0) {
      if (valueSchema.default instanceof Date) {
        return buildDateString(valueSchema.default);
      } else if (typeof valueSchema.default === "string") {
        return valueSchema.default;
      }
      return void 0;
    }
    return void 0;
  }
  if (value instanceof Date) {
    return buildDateString(value);
  }
  if (typeof value === "string") {
    return value;
  }
  return void 0;
}
function buildDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// src/schema/revertData.ts
var BASIC_TYPES2 = ["string", "number", "integer", "boolean", "array", "date"];
var REVERT_VALUE_FUNCTIONS = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  boolean: revertBool,
  date: revertDate
};
function revertData(config, data, schema) {
  const row = {};
  for (const [key, value] of Object.entries(schema)) {
    let itemKey = key;
    if (value.key) {
      itemKey = value.key;
    }
    if (BASIC_TYPES2.includes(value.type)) {
      if (data[itemKey] === void 0) {
        continue;
      }
      const revertValueFunction = REVERT_VALUE_FUNCTIONS[value.type];
      if (revertValueFunction) {
        row[itemKey] = revertValueFunction(value, data[itemKey]);
      } else {
        row[itemKey] = data[itemKey];
      }
    } else if (value.type === "object" && value.properties && Object.keys(value.properties).length > 0) {
      if (data[itemKey] === void 0) {
        continue;
      }
      const subData = revertData(config, data[itemKey], value.properties);
      for (const [subKey, subValue] of Object.entries(subData)) {
        row[subKey] = subValue;
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
  const response = await makeRequest(credentials, clientConfig, schemaId, "Add", properties, row);
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}

// src/schema/methods/update.ts
async function update(credentials, clientConfig, schemaId, config, dataSchema, data, properties = {}) {
  let row;
  if (config.sendRawData) {
    row = data;
  } else {
    row = revertData(config, data, dataSchema);
  }
  const response = await makeRequest(credentials, clientConfig, schemaId, "Edit", properties, row);
  const singleItem = response[0];
  if (config.returnRawData) {
    return singleItem;
  }
  const result = buildData(config, singleItem, dataSchema);
  return result;
}
async function updateMany(credentials, clientConfig, schemaId, config, dataSchema, dataArray, properties = {}) {
  let rows;
  if (config.sendRawData) {
    rows = dataArray;
  } else {
    rows = dataArray.map((data) => revertData(config, data, dataSchema));
  }
  const response = await makeRequest(credentials, clientConfig, schemaId, "Edit", properties, rows);
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
  //ss get single item
  async findById(id) {
    if (!id) {
      throw new Error("ID is required to find an item by ID.");
    }
    return findById(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, id);
  }
  //ss get multiple items
  async find(properties = {}, rows = []) {
    return find(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, properties, rows);
  }
  //ss create item
  async create(data, properties = {}) {
    return create(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties);
  }
  //ss update item
  async update(data, properties = {}) {
    return update(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties);
  }
  //ss update multiple items
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
};

// src/client/client.ts
var defaultSystemContext = {
  config: {
    timezone: "UTC",
    returnRawData: false,
    sendRawData: false
  },
  client: {
    url: "https://www.appsheet.com",
    locale: "en-GB",
    timezone: process.env.TZ || "UTC"
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
  //ss create schema
  createSchema(schemaId, data) {
    return new Schema(this.credentials, this.systemContext.config, this.systemContext.client, schemaId, data);
  }
};
export {
  AppsheetClient
};
