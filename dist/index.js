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
async function makeRequest(config, table, properties = {}, action, rows, credentials) {
  const apiUrl = `${config.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`;
  console.log("API URL:", apiUrl);
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
  const [error, response] = await catchError_default(axios.post(apiUrl, body, { headers }));
  if (error) {
    const data = error instanceof axios.AxiosError && error.response ? error.response.data : null;
    console.error("Error al realizar la petici\xF3n:", data || error.message);
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
export {
  Client
};
