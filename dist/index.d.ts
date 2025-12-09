type Types = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'date' | 'object';
interface Data {
    type: Types;
    key?: string;
    primary?: boolean;
    default?: unknown;
    itemType?: 'string' | 'number' | 'integer' | 'datetime';
    properties?: {
        [key: string]: Data;
    };
}
interface ObjectData {
    [key: string]: Data;
}
type GenericObject = {
    [key: string]: unknown;
};

interface Credentials {
    appId: string;
    apiKey: string;
}
interface ClientConfig {
    url?: string;
    locale?: 'en-US' | 'en-GB';
    timezone?: string;
}
interface Config {
    timezone?: string;
    returnRawData?: boolean;
    sendRawData?: boolean;
}
interface SystemContext {
    client: ClientConfig;
    config: Config;
}

type Row = Record<string, string>;
interface Properties {
    Selector?: string;
    UserSettings?: Record<string, string>;
    [key: string]: unknown;
}
type AppsheetData = {
    [key: string]: string | undefined;
};

declare class Schema<T> {
    private readonly credentials;
    private readonly config;
    private readonly clientConfig;
    private readonly schemaId;
    private readonly dataSchema;
    constructor(credentials: Credentials, config: Config, clientConfig: ClientConfig, schemaId: string, dataSchema: ObjectData);
    findById(id: string): Promise<T | undefined>;
    find(properties?: Properties, rows?: Row | Row[]): Promise<T[]>;
    create(data: GenericObject, properties?: Properties): Promise<T>;
    createMany(dataArray: GenericObject[], properties?: Properties): Promise<T[]>;
    update(data: GenericObject, properties?: Properties): Promise<T>;
    updateMany(dataArray: GenericObject[], properties?: Properties): Promise<T[]>;
    delete(data: GenericObject, properties?: Properties): Promise<T>;
    deleteMany(dataArray: GenericObject[], properties?: Properties): Promise<T[]>;
}

declare class AppsheetClient {
    private readonly credentials;
    private readonly systemContext;
    constructor(credentials: Credentials, systemContext?: Partial<SystemContext>);
    createSchema<T>(schemaId: string, data: ObjectData): Schema<T>;
}

export { AppsheetClient, type AppsheetData, type ClientConfig, type Config, type Credentials, type Data, type GenericObject, type ObjectData, type Properties, type Row, type SystemContext, type Types };
