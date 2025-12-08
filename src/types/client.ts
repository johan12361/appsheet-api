export interface ClientConfig {
  url: string
  locale: 'en-US' | 'en-GB'
  timezone: string
}

export interface Credentials {
  appId: string
  apiKey: string
}

export interface Config {
  timezone: string
}
