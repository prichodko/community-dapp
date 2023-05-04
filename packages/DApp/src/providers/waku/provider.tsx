import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Protocols } from 'js-waku'
import { createLightNode } from 'js-waku/lib/create_waku'
import { PeerDiscoveryStaticPeers } from 'js-waku/lib/peer_discovery_static_list'
import { waitForRemotePeer } from 'js-waku/lib/wait_for_remote_peer'
import type { WakuLight } from 'js-waku/lib/interfaces'
import { peers } from '../../constants/peers'
import { config } from '../../config'

const WakuContext = createContext<WakuLight | undefined>(undefined)

interface Props {
  children: ReactNode
}

export function WakuProvider({ children }: Props) {
  const [waku, setWaku] = useState<WakuLight>()

  useEffect(() => {
    const start = async () => {
      const waku = await createLightNode({
        defaultBootstrap: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        emitSelf: true,
        libp2p: {
          peerDiscovery: [new PeerDiscoveryStaticPeers(peers[config.wakuConfig.environment], { maxPeers: 1 })],
        },
      })

      await waku.start()
      await waitForRemotePeer(waku, [Protocols.Store, Protocols.LightPush], 15 * 1000)

      setWaku(waku)
    }

    start()
  }, [])

  return <WakuContext.Provider value={waku}>{children}</WakuContext.Provider>
}

export function useWaku() {
  const waku = useContext(WakuContext)

  return { waku }
}
