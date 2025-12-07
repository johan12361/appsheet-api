interface Data {
    type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'date' | 'object' | 'jsonObject';
    key?: string;
    primary?: boolean;
    required?: boolean;
    default?: unknown;
    itemType?: 'string' | 'number' | 'integer' | 'boolean' | 'datetime';
    properties?: {
        [key: string]: Data;
    };
}
interface ObjectData {
    [key: string]: Data;
}

interface Credentials {
    appId: string;
    apiKey: string;
}

interface ClientConfig {
    url: string;
    locale: 'en-US' | 'en-GB';
    timezone: string;
}

declare class Schema<T> {
    readonly credentials: Credentials;
    readonly config: ClientConfig;
    readonly schemaId: string;
    readonly dataSchema: ObjectData;
    constructor(credentials: Credentials, config: ClientConfig, schemaId: string, dataSchema: ObjectData);
    getAll(): Promise<T[]>;
}

declare class Client {
    readonly credentials: Credentials;
    readonly config: ClientConfig;
    constructor(credentials: Credentials, config?: Partial<ClientConfig>);
    createSchema<T>(schemaId: string, data: ObjectData): Schema<T>;
}

export { Client };
