/// <reference types="vite/client" />

declare namespace NodeJS {
  export interface ProcessEnv {
    ENV: 'localhost' | 'development' | 'production'
  }
}
