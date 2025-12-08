export interface Credentials {
  appId: string
  apiKey: string
}

export interface ClientConfig {
  url?: string
  locale?: 'en-US' | 'en-GB'
  timezone?: string
}

export interface Config {
  timezone?: string
  returnRawData?: boolean
  sendRawData?: boolean
  //NEXT ADD OTHER CONFIG OPTIONS
}

export interface SystemContext {
  client: ClientConfig
  config: Config
}
