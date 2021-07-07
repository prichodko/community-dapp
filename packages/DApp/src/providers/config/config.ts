import { v4 as uuidv4 } from 'uuid'

export interface Config {
  numberPerPage: number
  wakuTopic: string
  contracts: {
    [chainID: number]: {
      [name: string]: string
    }
  }
}

interface EnvConfigs {
  [env: string]: Config
}

const contracts = {
  3: {
    votingContract: '0x942C8248d14c20b9E79d7A60178B5b17Dd7186c3',
  },
}

export const config: EnvConfigs = {
  localhost: {
    wakuTopic: `/myApp/localhost/${uuidv4()}/0.0.2/votingRoom/`,
    numberPerPage: 2,
    contracts,
  },
  development: {
    wakuTopic: '/myApp/development/0.0.2/votingRoom/',
    numberPerPage: 3,
    contracts,
  },
  production: {
    wakuTopic: '/myApp/production/0.0.2/votingRoom/',
    numberPerPage: 4,
    contracts,
  },
}

export const getEnvConfig = (env: string | undefined) => {
  if (env) {
    return config[env]
  } else {
    return config['development']
  }
}
