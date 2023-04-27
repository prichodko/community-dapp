// todo: request QtWebEngine (browser) to updated instead
import 'core-js/proposals/promise-any'
import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import {
  DAppProvider,
  ChainId,
  Config,
  Optimism,
  OptimismGoerli,
  Ropsten,
  Localhost,
  Goerli,
  Hardhat,
} from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import { ConfigProvider } from './providers/config/provider'
import { WakuProvider } from './providers/waku/provider'
import { CommunitiesProvider } from './providers/communities/provider'
import { WakuFeatureProvider } from './providers/wakuFeature/provider'
import { contracts, getDAppConfig } from './providers/config/config'

const config: Config = {
  readOnlyChainId: ChainId.Optimism,
  readOnlyUrls: {
    // [ChainId.Optimism]:

    // [ChainId.Ropsten]: 'https://ropsten.infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
    [ChainId.Optimism]: 'http://127.0.0.2:8545',
    [ChainId.Hardhat]: 'http://127.0.0.1:8545',
  },

  networks: [Localhost, Hardhat, Optimism],

  // multicallAddresses: {
  //   ...DEFAULT_CONFIG.multicallAddresses,
  //   [ChainId.Ropsten]: contracts[ChainId.Ropsten].multicallContract,
  //   [CustomChainId.OptimismGoerli]: contracts[CustomChainId.OptimismGoerli].multicallContract,
  //   [ChainId.Hardhat]: contracts[ChainId.Hardhat].multicallContract,
  // },
  multicallAddresses: {
    [ChainId.Hardhat]: contracts[ChainId.Hardhat].multicallContract,
  },
  // supportedChains: [...DEFAULT_CONFIG.supportedChains, CustomChainId.OptimismGoerli],
  // multicallVersion: 2,

  notifications: {
    checkInterval: 500,
    expirationPeriod: 50000,
  },
}

render(
  <React.StrictMode>
    <ConfigProvider>
      <WakuProvider>
        <DAppProvider config={config}>
          <CommunitiesProvider>
            <WakuFeatureProvider>
              <App />
            </WakuFeatureProvider>
          </CommunitiesProvider>
        </DAppProvider>
      </WakuProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
