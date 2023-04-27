import { useEffect } from 'react'
import { CommunityDetail } from '../models/community'
import { useCommunities } from './useCommunities'
import { useWaku } from '../providers/waku/provider'
import { RequestClient, deserializePublicKey } from '@status-im/js'

export function useCommunityDetails(publicKey: string, setCommunityDetail: (val: CommunityDetail | undefined) => void) {
  // const [CommunityDetail] = useCommunities(publicKey ? [publicKey] : [])

  const { waku } = useWaku()
  console.log('useCommunityDetails > waku:', waku)

  useEffect(() => {
    if (!waku || !publicKey) return
    console.log('FETCHING')

    const fetchCommunity = async () => {
      // const requestClient = await RequestClient.start({ environment: 'test' })
      const requestClient = new RequestClient(waku)
      console.log('fetchCommunity > RequestClient:', RequestClient)

      const deserializedPublicKey = deserializePublicKey(publicKey)
      const detail = await requestClient.fetchCommunityDescription(deserializedPublicKey)
      console.log('fetchCommunity > detail:', waku, detail)
    }

    fetchCommunity()

    // setCommunityDetail(CommunityDetail)
  }, [waku, publicKey])

  return false
}
