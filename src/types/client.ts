export interface Credentials {
  appId: string
  apiKey: string
}

export interface ClientConfig {
  url?: string
  locale?: 'en-US' | 'en-GB'
  timezone?: string
  userSettings?: Record<string, unknown>
}

export interface Config {
  timezone?: string
  returnRawData?: boolean
  sendRawData?: boolean
  maxRetriesOnRateLimit?: number
  retryDelay?: number
  //NEXT ADD OTHER CONFIG OPTIONS
}

export interface SystemContext {
  client: ClientConfig
  config: Config
}
